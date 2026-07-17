package org.example.service.imp;

import lombok.RequiredArgsConstructor;
import org.example.entity.*;
import org.example.repository.*;
import org.example.service.AdminService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final DonationRepository donationRepository;
    private final UserRepository userRepository;
    private final CampaignRepository campaignRepository;
    private final SecurityEventRepository securityEventRepository;

    @Override
    public Map<String, Object> health() {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("ok", true);
        body.put("redis", "mongodb");
        body.put("rabbitmq", "mongodb");
        body.put("websocket", false);
        body.put("timestamp", LocalDateTime.now().toString());
        body.put("source", "spring");
        return body;
    }

    @Override
    public Map<String, Object> reports(String period) {
        String normalized = period == null ? "daily" : period.toLowerCase(Locale.ROOT);
        LocalDateTime since;
        List<String> labels;
        int growth;

        switch (normalized) {
            case "weekly" -> {
                since = LocalDate.now().minusDays(6).atStartOfDay();
                labels = new ArrayList<>();
                for (int i = 6; i >= 0; i--) {
                    labels.add(LocalDate.now().minusDays(i).format(DateTimeFormatter.ofPattern("EEE")));
                }
                growth = 12;
            }
            case "monthly" -> {
                since = LocalDate.now().minusDays(29).atStartOfDay();
                labels = List.of("W1", "W2", "W3", "W4");
                growth = 18;
            }
            default -> {
                normalized = "daily";
                since = LocalDate.now().atStartOfDay();
                labels = List.of("00", "04", "08", "12", "16", "20", "24");
                growth = 8;
            }
        }

        List<Donation> donations = donationRepository.findByDonatedAtAfterOrderByDonatedAtAsc(since);
        List<BigDecimal> raised = new ArrayList<>();
        List<Integer> counts = new ArrayList<>();

        if ("monthly".equals(normalized)) {
            for (int week = 0; week < 4; week++) {
                LocalDateTime start = LocalDate.now().minusDays(29 - (week * 7L)).atStartOfDay();
                LocalDateTime end = start.plusDays(7);
                List<Donation> bucket = donations.stream()
                        .filter(d -> d.getDonatedAt() != null
                                && !d.getDonatedAt().isBefore(start)
                                && d.getDonatedAt().isBefore(end)
                                && d.getStatus() == Donation.DonationStatus.SUCCESS)
                        .toList();
                raised.add(sum(bucket));
                counts.add(bucket.size());
            }
        } else if ("weekly".equals(normalized)) {
            for (int i = 6; i >= 0; i--) {
                LocalDate day = LocalDate.now().minusDays(i);
                List<Donation> bucket = donations.stream()
                        .filter(d -> d.getDonatedAt() != null
                                && d.getDonatedAt().toLocalDate().equals(day)
                                && d.getStatus() == Donation.DonationStatus.SUCCESS)
                        .toList();
                raised.add(sum(bucket));
                counts.add(bucket.size());
            }
        } else {
            int[] hours = {0, 4, 8, 12, 16, 20, 24};
            for (int i = 0; i < hours.length - 1; i++) {
                int startH = hours[i];
                int endH = hours[i + 1];
                List<Donation> bucket = donations.stream()
                        .filter(d -> {
                            if (d.getDonatedAt() == null || d.getStatus() != Donation.DonationStatus.SUCCESS) {
                                return false;
                            }
                            int h = d.getDonatedAt().getHour();
                            return h >= startH && h < endH;
                        })
                        .toList();
                raised.add(sum(bucket));
                counts.add(bucket.size());
            }
            raised.add(raised.isEmpty() ? BigDecimal.ZERO : raised.get(raised.size() - 1));
            counts.add(counts.isEmpty() ? 0 : counts.get(counts.size() - 1));
        }

        BigDecimal totalRaised = raised.stream().reduce(BigDecimal.ZERO, BigDecimal::add);
        int totalDonations = counts.stream().mapToInt(Integer::intValue).sum();
        BigDecimal avg = totalDonations == 0
                ? BigDecimal.ZERO
                : totalRaised.divide(BigDecimal.valueOf(totalDonations), 2, RoundingMode.HALF_UP);

        if (totalDonations == 0) {
            totalRaised = sum(donationRepository.findByStatus(Donation.DonationStatus.SUCCESS));
            totalDonations = (int) donationRepository.countByStatus(Donation.DonationStatus.SUCCESS);
            avg = totalDonations == 0
                    ? BigDecimal.ZERO
                    : totalRaised.divide(BigDecimal.valueOf(totalDonations), 2, RoundingMode.HALF_UP);
        }

        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("totalRaised", totalRaised);
        summary.put("totalDonations", totalDonations);
        summary.put("avgDonation", avg);
        summary.put("growth", growth);

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("period", normalized);
        body.put("labels", labels);
        body.put("raised", raised.stream().map(BigDecimal::doubleValue).toList());
        body.put("donations", counts);
        body.put("summary", summary);
        body.put("source", "mongodb");
        return body;
    }

    @Override
    public Map<String, Object> payments() {
        List<Map<String, Object>> payments = donationRepository.findAllByOrderByDonatedAtDesc()
                .stream()
                .limit(50)
                .map(this::toPaymentRow)
                .collect(Collectors.toList());

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("payments", payments);
        body.put("source", "mongodb");
        return body;
    }

    @Override
    public Map<String, Object> userProfiles() {
        List<Map<String, Object>> profiles = userRepository.findAll().stream()
                .map(user -> {
                    List<Donation> userDonations = donationRepository.findByUserIdAndStatus(
                            user.getId(),
                            Donation.DonationStatus.SUCCESS
                    );
                    BigDecimal total = sum(userDonations);
                    long donationCount = donationRepository.findByUserIdOrderByDonatedAtDesc(user.getId()).size();

                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("id", user.getId());
                    row.put("name", user.getFullName());
                    row.put("email", user.getEmail());
                    row.put("phone", user.getPhone() != null ? user.getPhone() : "—");
                    row.put("city", user.getLocation() != null ? user.getLocation() : (user.getAddress() != null ? user.getAddress() : "—"));
                    row.put("role", user.getRole() == User.Role.ADMIN ? "Admin" : "Donor");
                    row.put("status", "Active");
                    row.put("joined", user.getMemberSince() != null
                            ? user.getMemberSince().toString()
                            : "—");
                    row.put("donations", donationCount);
                    row.put("total", total);
                    row.put("kyc", user.getRole() == User.Role.ADMIN || total.compareTo(BigDecimal.ZERO) > 0);
                    row.put("panVerified", Boolean.TRUE.equals(user.getReceiveUpdates()));
                    row.put("lastActive", LocalDate.now().toString());
                    return row;
                })
                .toList();

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("profiles", profiles);
        body.put("source", "mongodb");
        return body;
    }

    @Override
    public Map<String, Object> securityEvents() {
        List<Map<String, Object>> events = securityEventRepository.findTop50ByOrderByCreatedAtDesc()
                .stream()
                .map(this::toSecurityRow)
                .toList();

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("events", events);
        body.put("source", "mongodb");
        return body;
    }

    @Override
    public Map<String, Object> logSecurityEvent(Map<String, Object> body) {
        SecurityEvent event = SecurityEvent.builder()
                .type(stringVal(body.get("type"), "Login"))
                .userEmail(stringVal(body.get("user"), "unknown"))
                .ip(stringVal(body.get("ip"), "127.0.0.1"))
                .device(stringVal(body.get("device"), "Web"))
                .status(stringVal(body.get("status"), "Success"))
                .createdAt(LocalDateTime.now())
                .build();
        event = securityEventRepository.save(event);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("ok", true);
        response.put("event", toSecurityRow(event));
        return response;
    }

    @Override
    public Map<String, Object> simulateDonation(User actor) {
        Campaign campaign = campaignRepository.findByStatus(Campaign.CampaignStatus.ACTIVE)
                .stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No active campaign to simulate"));

        User donor = actor != null ? actor : userRepository.findAll().stream()
                .filter(u -> u.getRole() == User.Role.USER)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No donor user available"));

        BigDecimal amount = BigDecimal.valueOf(500 + new Random().nextInt(9500));
        Donation.PaymentMethod[] methods = Donation.PaymentMethod.values();
        Donation.PaymentMethod method = methods[new Random().nextInt(methods.length)];

        Donation donation = Donation.builder()
                .userId(donor.getId())
                .userFullName(donor.getFullName())
                .campaignId(campaign.getId())
                .campaignTitle(campaign.getTitle())
                .cause(campaign.getCause())
                .amount(amount)
                .paymentMethod(method)
                .message("Simulated admin donation")
                .anonymous(false)
                .donatedAt(LocalDateTime.now())
                .status(Donation.DonationStatus.SUCCESS)
                .build();
        donation = donationRepository.save(donation);

        campaign.setRaisedAmount(
                Optional.ofNullable(campaign.getRaisedAmount()).orElse(BigDecimal.ZERO).add(amount)
        );
        campaignRepository.save(campaign);

        Map<String, Object> live = new LinkedHashMap<>();
        live.put("id", "TXN-LIVE-" + donation.getId());
        live.put("donor", Boolean.TRUE.equals(donation.getAnonymous()) ? "Anonymous" : donor.getFullName());
        live.put("email", donor.getEmail());
        live.put("campaign", campaign.getTitle());
        live.put("campaignId", "CMP-" + campaign.getId());
        live.put("amount", "Rs " + amount.setScale(0, RoundingMode.HALF_UP).toPlainString());
        live.put("method", toUiMethod(method));
        live.put("date", LocalDate.now().toString());
        live.put("time", LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm")));
        live.put("status", "Success");
        live.put("reference", "REF/" + donation.getId());

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("ok", true);
        response.put("donation", live);
        return response;
    }

    private Map<String, Object> toPaymentRow(Donation donation) {
        Map<String, Object> row = new LinkedHashMap<>();
        row.put("id", "PAY-" + donation.getId());
        row.put("donor", Boolean.TRUE.equals(donation.getAnonymous())
                ? "Anonymous"
                : (donation.getUserFullName() != null ? donation.getUserFullName() : "Donor"));
        row.put("campaign", donation.getCampaignTitle() != null ? donation.getCampaignTitle() : "—");
        row.put("amount", donation.getAmount());
        row.put("method", toUiMethod(donation.getPaymentMethod()));
        row.put("status", toUiStatus(donation.getStatus()));
        row.put("date", donation.getDonatedAt() != null
                ? donation.getDonatedAt().toLocalDate().toString()
                : "—");
        row.put("gateway", switch (donation.getPaymentMethod() == null
                ? Donation.PaymentMethod.UPI
                : donation.getPaymentMethod()) {
            case CARD -> "Stripe";
            case NET_BANKING -> "HDFC";
            default -> "Razorpay";
        });
        row.put("settlementId", donation.getStatus() == Donation.DonationStatus.SUCCESS
                ? "STL-" + donation.getId()
                : null);
        return row;
    }

    private Map<String, Object> toSecurityRow(SecurityEvent event) {
        Map<String, Object> row = new LinkedHashMap<>();
        row.put("id", event.getId());
        row.put("type", event.getType());
        row.put("user", event.getUserEmail());
        row.put("ip", event.getIp());
        row.put("device", event.getDevice());
        row.put("status", event.getStatus());
        row.put("time", event.getCreatedAt() != null
                ? event.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"))
                : "—");
        return row;
    }

    private static BigDecimal sum(List<Donation> donations) {
        return donations.stream()
                .map(Donation::getAmount)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private static String toUiMethod(Donation.PaymentMethod method) {
        if (method == null) return "UPI";
        return switch (method) {
            case CARD -> "Card";
            case NET_BANKING -> "Net Banking";
            default -> "UPI";
        };
    }

    private static String toUiStatus(Donation.DonationStatus status) {
        if (status == null) return "Processing";
        return switch (status) {
            case SUCCESS -> "Settled";
            case FAILED -> "Failed";
            case PENDING -> "Processing";
        };
    }

    private static String stringVal(Object value, String fallback) {
        if (value == null) return fallback;
        String text = String.valueOf(value).trim();
        return text.isEmpty() ? fallback : text;
    }
}
