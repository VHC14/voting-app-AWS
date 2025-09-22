package com.votingapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.votingapp.model.Candidate;

public interface CandidateRepository extends JpaRepository<Candidate, Long> {}