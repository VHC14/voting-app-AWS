# Comprehensive API Testing Script for Voting App
# Run this in PowerShell to test all endpoints

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Voting App API Testing Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$baseUrl = "http://localhost:8080/api"

# Test 1: Get all candidates
Write-Host "`n1. Testing GET /candidates" -ForegroundColor Yellow
try {
    $candidates = Invoke-RestMethod -Uri "$baseUrl/candidates" -Method Get
    Write-Host "✅ SUCCESS: Retrieved $($candidates.Count) candidates" -ForegroundColor Green
    $candidates | Format-Table
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Test admin login
Write-Host "`n2. Testing POST /auth/login (admin)" -ForegroundColor Yellow
try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -ContentType "application/json" -Body '{"username":"admin","password":"admin123"}'
    Write-Host "✅ SUCCESS: Admin login returned: $loginResponse" -ForegroundColor Green
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Test user login
Write-Host "`n3. Testing POST /auth/login (user)" -ForegroundColor Yellow
try {
    $userLoginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -ContentType "application/json" -Body '{"username":"user1","password":"password"}'
    Write-Host "✅ SUCCESS: User login returned: $userLoginResponse" -ForegroundColor Green
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Test vote results
Write-Host "`n4. Testing GET /vote/results" -ForegroundColor Yellow
try {
    $results = Invoke-RestMethod -Uri "$baseUrl/vote/results" -Method Get
    Write-Host "✅ SUCCESS: Retrieved voting results" -ForegroundColor Green
    $results | Format-Table
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Test adding a candidate (admin function)
Write-Host "`n5. Testing POST /candidates/add" -ForegroundColor Yellow
try {
    $newCandidate = Invoke-RestMethod -Uri "$baseUrl/candidates/add" -Method Post -ContentType "application/json" -Body '{"name":"Test Candidate"}'
    Write-Host "✅ SUCCESS: Added candidate" -ForegroundColor Green
    $newCandidate | Format-Table
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 6: Test casting a vote
Write-Host "`n6. Testing POST /vote/{userId}/{candidateId}" -ForegroundColor Yellow
try {
    $voteResponse = Invoke-RestMethod -Uri "$baseUrl/vote/3/1" -Method Post
    Write-Host "✅ SUCCESS: Vote response: $voteResponse" -ForegroundColor Green
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Response: $($_.Exception.Response)" -ForegroundColor Red
}

# Test 7: Test duplicate vote (should fail)
Write-Host "`n7. Testing duplicate vote (should return 'already voted')" -ForegroundColor Yellow
try {
    $duplicateVoteResponse = Invoke-RestMethod -Uri "$baseUrl/vote/3/1" -Method Post
    Write-Host "✅ SUCCESS: Duplicate vote response: $duplicateVoteResponse" -ForegroundColor Green
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 8: Test registration
Write-Host "`n8. Testing POST /auth/register" -ForegroundColor Yellow
try {
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -ContentType "application/json" -Body '{"username":"testuser2","password":"testpass"}'
    Write-Host "✅ SUCCESS: Registration response: $registerResponse" -ForegroundColor Green
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  API Testing Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan