package com.votingapp.controller;

import com.votingapp.model.Candidate;
import com.votingapp.repository.CandidateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/candidates")
public class CandidateController {

    @Autowired
    private CandidateRepository candidateRepository;

    @GetMapping
    public List<Candidate> getAllCandidates() {
        try {
            return candidateRepository.findAll();
        } catch (Exception e) {
            System.err.println("Error fetching candidates: " + e.getMessage());
            throw new RuntimeException("Failed to fetch candidates: " + e.getMessage());
        }
    }

    @PostMapping("/add")
    public Candidate addCandidate(@RequestBody Candidate candidate) {
        try {
            candidate.setVotes(0);
            return candidateRepository.save(candidate);
        } catch (Exception e) {
            System.err.println("Error adding candidate: " + e.getMessage());
            throw new RuntimeException("Failed to add candidate: " + e.getMessage());
        }
    }

    @PutMapping("/update/{id}")
    public Candidate updateCandidate(@PathVariable Long id, @RequestBody Candidate candidate) {
        try {
            Candidate c = candidateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Candidate not found with id: " + id));
            c.setName(candidate.getName());
            return candidateRepository.save(c);
        } catch (Exception e) {
            System.err.println("Error updating candidate: " + e.getMessage());
            throw new RuntimeException("Failed to update candidate: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public String deleteCandidate(@PathVariable Long id) {
        try {
            if (!candidateRepository.existsById(id)) {
                return "Candidate not found with id: " + id;
            }
            candidateRepository.deleteById(id);
            return "Candidate deleted";
        } catch (Exception e) {
            System.err.println("Error deleting candidate: " + e.getMessage());
            return "Failed to delete candidate: " + e.getMessage();
        }
    }
}
