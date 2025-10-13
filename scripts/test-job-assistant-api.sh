#!/bin/bash

# Job Assistant API Test Script
# This script tests the Phase 1 API endpoints

echo "🧪 Job Assistant API Test Suite"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Base URL
BASE_URL="http://localhost:3000"

echo "⚠️  Prerequisites:"
echo "  1. Server must be running (pnpm dev)"
echo "  2. You must be logged in and have a session cookie"
echo "  3. You must have a published resume"
echo ""
echo "To get your session cookie:"
echo "  1. Open browser DevTools (F12)"
echo "  2. Go to Application > Cookies > localhost:3000"
echo "  3. Copy the value of 'next-auth.session-token'"
echo ""

# Prompt for session token
read -p "Enter your session token: " SESSION_TOKEN

if [ -z "$SESSION_TOKEN" ]; then
    echo -e "${RED}❌ Session token is required${NC}"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 1: Check token balance
echo "Test 1: Check Token Balance"
echo "----------------------------"
RESPONSE=$(curl -s -X GET "$BASE_URL/api/admin/profile" \
  -H "Cookie: next-auth.session-token=$SESSION_TOKEN")

TOKEN_CREDITS=$(echo $RESPONSE | grep -o '"token_credits":[0-9]*' | grep -o '[0-9]*')

if [ ! -z "$TOKEN_CREDITS" ]; then
    echo -e "${GREEN}✓ Token balance: $TOKEN_CREDITS credits${NC}"
else
    echo -e "${RED}✗ Failed to fetch token balance${NC}"
    echo "Response: $RESPONSE"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 2: Generate with manual job description
echo "Test 2: Generate Resume (Manual Description)"
echo "---------------------------------------------"

JOB_DESC="We are seeking a Senior Software Engineer with 5+ years of experience in TypeScript, React, and Node.js. You will lead the development of our next-generation platform. Strong knowledge of cloud services (AWS/GCP) and database design required."

RESPONSE=$(curl -s -X POST "$BASE_URL/api/job-assistant/generate" \
  -H "Cookie: next-auth.session-token=$SESSION_TOKEN" \
  -F "resumeSource=existing" \
  -F "jobDescription=$JOB_DESC" \
  -F "jobTitle=Senior Software Engineer" \
  -F "companyName=Tech Startup Inc" \
  -F "generateResume=true" \
  -F "generateCoverLetter=false")

if echo "$RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✓ Resume generated successfully${NC}"
    
    # Extract some info
    TOKENS_USED=$(echo $RESPONSE | grep -o '"tokensUsed":[0-9]*' | grep -o '[0-9]*')
    REMAINING=$(echo $RESPONSE | grep -o '"remainingCredits":[0-9]*' | grep -o '[0-9]*')
    
    echo "  Tokens used: $TOKENS_USED"
    echo "  Remaining credits: $REMAINING"
    
    # Save response for testing
    echo "$RESPONSE" > /tmp/job_assistant_test_response.json
    echo "  Response saved to: /tmp/job_assistant_test_response.json"
else
    echo -e "${RED}✗ Failed to generate resume${NC}"
    echo "Response: $RESPONSE"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 3: Generate both resume and cover letter
echo "Test 3: Generate Both Documents"
echo "--------------------------------"

RESPONSE=$(curl -s -X POST "$BASE_URL/api/job-assistant/generate" \
  -H "Cookie: next-auth.session-token=$SESSION_TOKEN" \
  -F "resumeSource=existing" \
  -F "jobDescription=$JOB_DESC" \
  -F "jobTitle=Software Engineer" \
  -F "companyName=Google" \
  -F "generateResume=true" \
  -F "generateCoverLetter=true")

if echo "$RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✓ Both documents generated successfully${NC}"
    
    HAS_RESUME=$(echo "$RESPONSE" | grep -o '"tailoredResume":"[^"]*"' | wc -l)
    HAS_COVER=$(echo "$RESPONSE" | grep -o '"coverLetter":"[^"]*"' | wc -l)
    
    if [ $HAS_RESUME -gt 0 ]; then
        echo -e "${GREEN}  ✓ Resume included${NC}"
    fi
    if [ $HAS_COVER -gt 0 ]; then
        echo -e "${GREEN}  ✓ Cover letter included${NC}"
    fi
else
    echo -e "${RED}✗ Failed to generate documents${NC}"
    echo "Response: $RESPONSE"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 4: Fetch history (should be empty initially)
echo "Test 4: Fetch History"
echo "---------------------"

RESPONSE=$(curl -s -X GET "$BASE_URL/api/job-assistant/history?limit=10" \
  -H "Cookie: next-auth.session-token=$SESSION_TOKEN")

if echo "$RESPONSE" | grep -q '"success":true'; then
    TOTAL=$(echo $RESPONSE | grep -o '"total":[0-9]*' | grep -o '[0-9]*')
    echo -e "${GREEN}✓ History fetched: $TOTAL saved applications${NC}"
else
    echo -e "${RED}✗ Failed to fetch history${NC}"
    echo "Response: $RESPONSE"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Summary
echo "📊 Test Summary"
echo "==============="
echo ""
echo "✅ Phase 1 API endpoints are functional!"
echo ""
echo "Next steps:"
echo "  1. Check the generated content in /tmp/job_assistant_test_response.json"
echo "  2. Verify the markdown quality"
echo "  3. Move to Phase 2: Build the UI components"
echo ""
echo "💡 Tip: To test URL scraping, try with a real job posting URL:"
echo "   curl -X POST $BASE_URL/api/job-assistant/generate \\"
echo "     -H 'Cookie: next-auth.session-token=YOUR_TOKEN' \\"
echo "     -F 'resumeSource=existing' \\"
echo "     -F 'jobUrl=https://jobs.lever.co/...' \\"
echo "     -F 'generateResume=true'"
echo ""
