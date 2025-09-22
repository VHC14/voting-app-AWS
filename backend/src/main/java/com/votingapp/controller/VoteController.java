package com.votingapp.controller;

import com.votingapp.model.Candidate;
import com.votingapp.model.Vote;
import com.votingapp.repository.CandidateRepository;
import com.votingapp.repository.VoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vote")
public class VoteController {

    @Autowired
    private VoteRepository voteRepository;

    @Autowired
    private CandidateRepository candidateRepository;

    @PostMapping("/{userId}/{candidateId}")
    public String castVote(
            @PathVariable("userId") Long userId,
            @PathVariable("candidateId") Long candidateId) {
        try {
            if(voteRepository.existsByUserId(userId)) {
                return "You have already voted!";
            }
            
            // Check if candidate exists
            if (!candidateRepository.existsById(candidateId)) {
                return "Candidate not found!";
            }
            
            Vote vote = new Vote();
            vote.setUserId(userId);
            vote.setCandidateId(candidateId);
            voteRepository.save(vote);

            Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));
            candidate.setVotes(candidate.getVotes() + 1);
            candidateRepository.save(candidate);

            return "Vote cast successfully!";
        } catch (Exception e) {
            System.err.println("Error casting vote: " + e.getMessage());
            return "Failed to cast vote: " + e.getMessage();
        }
    }

    @GetMapping("/results")
    public List<Candidate> getResults() {
        try {
            return candidateRepository.findAll();
        } catch (Exception e) {
            System.err.println("Error fetching results: " + e.getMessage());
            throw new RuntimeException("Failed to fetch results: " + e.getMessage());
        }
    }
}
