package org.example.controller;


import jakarta.validation.Valid;
import org.example.entity.User;
import org.example.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    @Autowired
    private UserService service;
    @PostMapping
    public User create(@Valid @RequestBody User user){
        return service.save(user);
    }
    @PostMapping("/login")
    public String login(@RequestBody User user){

        User existing =
                service.login(user.getEmail(), user.getPassword());

        return "Login Success";
    }
    @GetMapping
    public List<User> getAll(){
        return service.getAll();
    }
    @GetMapping("/{id}")
    public User getById(@PathVariable Long id){
        return service.getById(id);
    }

    @PutMapping("/{id}")
    public User update(@PathVariable Long id, @Valid @RequestBody User user){
        return service.update(id,user);
    }
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id){
        service.delete(id);
        return "User deleted successfully";
    }
}
