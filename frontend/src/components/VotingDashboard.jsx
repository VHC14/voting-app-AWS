import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Vote, 
  Trophy, 
  Users, 
  BarChart3, 
  RefreshCw, 
  CheckCircle,
  AlertCircle,
  User,
  Calendar
} from 'lucide-react';
import { candidatesAPI, votingAPI } from '../api';
import { useAuth } from '../contexts/AuthContext';

const VotingDashboard = () => {
  const { user } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // Fetch candidates on component mount
  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    setLoading(true);
    const response = await candidatesAPI.getAll();
    if (response.success) {
      setCandidates(response.data);
      setError('');
    } else {
      const errorMessage = typeof response.error === 'string' 
        ? response.error 
        : response.error?.message || 'Failed to load candidates';
      setError(errorMessage);
    }
    setLoading(false);
  };

  const handleVote = async (candidateId) => {
    if (!user?.id) {
      setError('User ID not found. Please login again.');
      return;
    }

    setVoting(true);
    setError('');
    
    const response = await votingAPI.castVote(user.id, candidateId);
    if (response.success) {
      if (response.data === 'You have already voted!') {
        setError('You have already voted!');
        setHasVoted(true);
      } else {
        setSuccess('Vote cast successfully!');
        setHasVoted(true);
        setSelectedCandidate(candidateId);
        // Refresh candidates to show updated vote count
        await fetchCandidates();
      }
    } else {
      const errorMessage = typeof response.error === 'string' 
        ? response.error 
        : response.error?.message || 'Failed to cast vote';
      setError(errorMessage);
    }
    setVoting(false);
  };

  const handleShowResults = async () => {
    setShowResults(true);
    await fetchCandidates(); // Refresh to get latest results
  };

  const getTotalVotes = () => {
    return candidates.reduce((total, candidate) => total + candidate.votes, 0);
  };

  const getVotePercentage = (votes) => {
    const total = getTotalVotes();
    return total > 0 ? (votes / total) * 100 : 0;
  };

  const getLeadingCandidate = () => {
    return candidates.reduce((prev, current) => 
      (prev.votes > current.votes) ? prev : current
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-black text-lg">Loading candidates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-black mb-2">
            🗳️ Voting Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Welcome, <span className="font-semibold">{user?.username}</span>!
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-gray-100 rounded-full mr-4">
                <Users className="w-8 h-8 text-black" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Candidates</p>
                <p className="text-2xl font-bold text-gray-800">{candidates.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full mr-4">
                <Vote className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Votes</p>
                <p className="text-2xl font-bold text-gray-800">{getTotalVotes()}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full mr-4">
                <Trophy className="w-8 h-8 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Leading Candidate</p>
                <p className="text-lg font-bold text-gray-800">
                  {candidates.length > 0 ? getLeadingCandidate().name : 'N/A'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Error/Success Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center"
            >
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              {success}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchCandidates}
            className="btn-secondary flex items-center space-x-2"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Refresh</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShowResults}
            className="btn-primary flex items-center space-x-2"
          >
            <BarChart3 className="w-5 h-5" />
            <span>Show Results</span>
          </motion.button>
        </div>

        {/* Candidates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((candidate, index) => (
            <motion.div
              key={candidate.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`card p-6 card-hover ${
                selectedCandidate === candidate.id ? 'ring-2 ring-green-500' : ''
              }`}
            >
              {/* Candidate Avatar */}
              <div className="text-center mb-4">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {candidate.name}
                </h3>
                
                {/* Vote Count */}
                <div className="flex items-center justify-center space-x-2 text-gray-600 mb-4">
                  <Vote className="w-4 h-4" />
                  <span>{candidate.votes} votes</span>
                </div>

                {/* Vote Percentage Bar (only show in results mode) */}
                {showResults && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Vote Share</span>
                      <span>{getVotePercentage(candidate.votes).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${getVotePercentage(candidate.votes)}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="result-bar h-3 rounded-full"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Vote Button */}
              {!showResults && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleVote(candidate.id)}
                  disabled={voting || hasVoted}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                    hasVoted
                      ? selectedCandidate === candidate.id
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'btn-primary'
                  }`}
                >
                  {voting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Voting...</span>
                    </div>
                  ) : hasVoted ? (
                    selectedCandidate === candidate.id ? (
                      <div className="flex items-center justify-center space-x-2">
                        <CheckCircle className="w-5 h-5" />
                        <span>Voted</span>
                      </div>
                    ) : (
                      'Voting Disabled'
                    )
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Vote className="w-5 h-5" />
                      <span>Vote for {candidate.name}</span>
                    </div>
                  )}
                </motion.button>
              )}

              {/* Leading indicator */}
              {showResults && candidate.votes > 0 && candidate.id === getLeadingCandidate().id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 right-4"
                >
                  <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                    <Trophy className="w-3 h-3 mr-1" />
                    Leading
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* No Candidates Message */}
        {candidates.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="card p-8 max-w-md mx-auto">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                No Candidates Yet
              </h3>
              <p className="text-gray-600">
                No candidates have been added to the system yet.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default VotingDashboard;