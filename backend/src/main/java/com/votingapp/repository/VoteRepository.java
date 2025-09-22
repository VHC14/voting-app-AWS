package com.votingapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.votingapp.model.Vote;

public interface VoteRepository extends JpaRepository<Vote, Long> {
    boolean existsByUserId(Long userId);
}
