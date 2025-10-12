# Profile Search & Filter Schema Recommendations

> **Goal**: Enhance search and discovery features for recruiters to find the right candidates

---

## 🎯 Current Data Structure

### Available in `resume_data.data` (JSONB):

```json
{
  "personal": {
    "name": "string",
    "title": "string",
    "email": "string",
    "phone": "string",
    "location": "string",  // ✅ CAPTURED
    "summary": "string"
  },
  "experience": [...],
  "education": [...],
  "skills": [...],
  "projects": [...]
}
```

### Available in `users` table:

- `profile_data` (JSONB) - Additional customizable data
- `theme_settings` (JSONB)
- `is_active` (boolean)

---

## 📊 Current Search Capabilities

✅ **Already Working:**

1. **Text Search**: Name, title, summary
2. **Location**: City, Country
3. **Skills**: Search within skills array
4. **Job Title**: Filter by professional title

---

## 🚀 Recommended Enhancements

### 1. **Structured Location Data**

**Problem**: Current location is free text (e.g., "San Francisco, CA", "SF", "San Francisco, California")

**Solution**: Parse and normalize location data

```typescript
// Add to profile_data or personal object
{
  "location": {
    "raw": "San Francisco, CA",
    "city": "San Francisco",
    "state": "California",
    "country": "United States",
    "coordinates": {
      "lat": 37.7749,
      "lng": -122.4194
    }
  }
}
```

**Benefits**:

- Consistent filtering
- Geographic radius search
- Location autocomplete
- Remote work filtering

---

### 2. **Experience Level / Seniority**

**Currently Missing**: Years of experience, seniority level

**Add to `profile_data`**:

```json
{
  "experience_level": {
    "years": 5,
    "level": "Mid-Level", // "Entry", "Mid-Level", "Senior", "Lead", "Executive"
    "calculated_from": "experience" // Auto-calculated or manual
  }
}
```

**Benefits**:

- Filter by experience level
- Better job matching
- Salary range alignment

---

### 3. **Availability & Job Preferences**

**Add to `profile_data`**:

```json
{
  "job_preferences": {
    "availability": "actively_looking", // "actively_looking", "open_to_offers", "not_looking"
    "job_type": ["full-time", "contract"], // "full-time", "part-time", "contract", "freelance"
    "remote": "hybrid", // "remote", "hybrid", "onsite"
    "willing_to_relocate": false,
    "desired_salary_range": {
      "min": 100000,
      "max": 150000,
      "currency": "USD"
    },
    "industries": ["Technology", "FinTech", "Healthcare"],
    "company_size": ["startup", "medium"] // "startup", "medium", "enterprise"
  }
}
```

**Benefits**:

- Show only available candidates
- Better job fit matching
- Reduce time wasted on unavailable candidates

---

### 4. **Enhanced Skills Taxonomy**

**Current**: Flat skill array per category

**Enhanced Structure**:

```json
{
  "skills": [
    {
      "category": "Frontend",
      "items": [
        {
          "name": "React",
          "proficiency": "expert", // "beginner", "intermediate", "advanced", "expert"
          "years": 5
        }
      ]
    }
  ],
  "certifications": [
    {
      "name": "AWS Certified Solutions Architect",
      "issuer": "Amazon",
      "year": 2023,
      "verified": true
    }
  ]
}
```

**Benefits**:

- Filter by proficiency level
- Years of experience with specific tech
- Certification verification

---

### 5. **Work Authorization & Visa Status**

**Add to `profile_data`**:

```json
{
  "work_authorization": {
    "countries": ["United States", "Canada"],
    "requires_sponsorship": false,
    "visa_type": "Green Card" // Optional
  }
}
```

**Benefits**:

- Critical for international hiring
- Reduce visa sponsorship mismatches

---

### 6. **Languages & Communication**

**Add to `profile_data`**:

```json
{
  "languages": [
    {
      "name": "English",
      "proficiency": "native" // "native", "fluent", "professional", "conversational", "basic"
    },
    {
      "name": "Spanish",
      "proficiency": "professional"
    }
  ]
}
```

**Benefits**:

- Filter for multilingual candidates
- Match communication requirements

---

### 7. **Portfolio Metrics & Engagement**

**Add to `users` table** (new columns or JSONB):

```json
{
  "portfolio_stats": {
    "views": 1250,
    "profile_completeness": 95, // Percentage
    "last_updated": "2025-10-01",
    "ai_chat_interactions": 45,
    "unique_visitors": 320,
    "response_rate": 85 // Percentage of recruiter messages responded to
  }
}
```

**Benefits**:

- Show popular profiles first
- Encourage profile completion
- Quality indicators for recruiters

---

### 8. **Social & Portfolio Links**

**Currently in `profile_data`**, ensure structure:

```json
{
  "social_links": {
    "linkedin": "https://linkedin.com/in/username",
    "github": "https://github.com/username",
    "portfolio": "https://mywebsite.com",
    "twitter": "https://twitter.com/username",
    "youtube": "https://youtube.com/@channel"
  },
  "verified_accounts": ["github", "linkedin"] // Verified via OAuth
}
```

**Benefits**:

- Additional credibility
- Link to work samples
- Verification trust signals

---

### 9. **Education Level**

**Add to `profile_data` or enhance education**:

```json
{
  "highest_education": "Master's", // "High School", "Associate", "Bachelor's", "Master's", "PhD"
  "field_of_study": "Computer Science"
}
```

**Benefits**:

- Filter by education requirements
- Academic background matching

---

### 10. **Keywords & Tags**

**Add to `profile_data`**:

```json
{
  "keywords": [
    "full-stack developer",
    "team lead",
    "agile",
    "startup experience",
    "open source contributor"
  ],
  "auto_generated_tags": ["AI/ML", "Cloud Native", "DevOps"] // Generated by AI from resume
}
```

**Benefits**:

- Better search relevance
- Semantic matching
- SEO optimization

---

## 🔍 Recommended Filter UI Updates

### Priority Filters:

1. **Location** + Remote/Hybrid/Onsite
2. **Job Title / Role**
3. **Skills** (multi-select)
4. **Experience Level**
5. **Availability Status**
6. **Work Authorization**

### Advanced Filters (Collapsible):

7. Salary Range
8. Education Level
9. Languages
10. Certifications
11. Company Size Preference
12. Industries

### Sort Options:

- Most Relevant (default)
- Recently Updated
- Most Viewed
- Experience Level
- Alphabetical

---

## 📝 Database Migration Considerations

### Option 1: Use Existing `profile_data` JSONB

**Pros**: No schema changes, flexible structure
**Cons**: Harder to index, slower complex queries

### Option 2: Add Dedicated Columns for Key Filters

```sql
ALTER TABLE users ADD COLUMN experience_level VARCHAR(50);
ALTER TABLE users ADD COLUMN remote_preference VARCHAR(20);
ALTER TABLE users ADD COLUMN availability_status VARCHAR(50);
CREATE INDEX idx_users_experience ON users(experience_level);
CREATE INDEX idx_users_remote ON users(remote_preference);
```

**Pros**: Faster queries, easier indexing
**Cons**: Less flexible, requires migrations

### Option 3: Hybrid Approach (Recommended)

- Critical filters → Dedicated columns with indexes
- Custom/flexible data → JSONB `profile_data`

---

## 🎨 User Experience Enhancements

### For Job Seekers:

1. **Profile Completion Wizard**: Guide users to add missing data
2. **Visibility Toggle**: Show/hide from public search
3. **Availability Badge**: Clear status indicator
4. **SEO Optimization**: Meta tags for each profile

### For Recruiters:

1. **Saved Searches**: Save filter combinations
2. **Candidate Collections**: Create lists/folders
3. **Bulk Contact**: Message multiple candidates
4. **Job Posting Match**: AI suggests best fits for a job description

---

## ✅ Implementation Priority

### Phase 1 (MVP - Already Done ✅):

- [x] Basic search by name, title, summary
- [x] Location filter
- [x] Skills filter
- [x] Job title filter

### Phase 2 (Next Steps):

- [ ] Add availability status to profile_data
- [ ] Add remote work preference
- [ ] Add experience level
- [ ] Enhance location with city/country separation
- [ ] Add profile completeness score

### Phase 3 (Advanced):

- [ ] Work authorization fields
- [ ] Language proficiency
- [ ] Certifications
- [ ] Salary expectations
- [ ] Portfolio stats tracking

### Phase 4 (Premium Features):

- [ ] Saved searches for recruiters
- [ ] AI-powered job matching
- [ ] Candidate recommendations
- [ ] Advanced analytics

---

## 🔧 Quick Wins to Implement Now

1. **Add to user profile form**:

   - Remote work preference (dropdown)
   - Availability status (dropdown)
   - Years of experience (auto-calculate or input)

2. **Update resume parser** to extract:

   - Total years of experience
   - Certifications
   - Languages mentioned

3. **Add profile completeness indicator**:

   - Encourages users to fill more data
   - Better search quality

4. **Create seed data** for testing filters

---

_Last Updated: October 2025_
_Version: 1.0_
