package com.votingapp.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.votingapp.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}