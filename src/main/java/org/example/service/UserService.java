package org.example.service;

import org.example.entity.User;
import org.example.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service

public class UserService {
    @Autowired
    private UserRepository repository;
    public User save(User user){
        return repository.save(user);
    }
    public List<User> getAll(){
        return repository.findAll();
    }
    public User login(String email,String password){

        return repository.findByEmail(email)
                .filter(u->u.getPassword().equals(password))
                .orElseThrow(
                        ()->new RuntimeException("Invalid credentials")
                );
    }
    public User getById(Long id){
        return repository.findById(id).orElseThrow(()->new RuntimeException("User not found"));
    }
    public User update(Long id, User user){
        User existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        existing.setName(user.getName());
        existing.setEmail(user.getEmail());
        existing.setPassword(user.getPassword());

        return repository.save(existing);
    }
    public void delete(Long id){
        repository.findById(id).orElseThrow(()->new RuntimeException("User not found"));
        repository.deleteById(id);
    }
}
