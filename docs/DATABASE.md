# CLOUD FIRESTORE DATABASE MODEL DOCUMENTATION

## 1. Primary Collections Schema

### `users/{userId}`
Stores user account profiles and role permissions.
```json
{
  "id": "string (matches Auth UID)",
  "email": "string",
  "displayName": "string",
  "role": "'admin' | 'teacher' | 'student'",
  "photoURL": "string (optional)",
  "createdAt": "ISO 8601 Timestamp",
  "updatedAt": "ISO 8601 Timestamp",
  "isActive": "boolean"
}
```

### `questions/{questionId}`
Master Question Bank collection managed by Admins.
```json
{
  "id": "string",
  "type": "'single_correct' | 'multiple_correct' | 'integer' | 'numerical' | 'match'",
  "subjectId": "string",
  "chapterId": "string",
  "questionText": "string",
  "questionImageUrl": "string (optional)",
  "options": [
    { "id": "opt_1", "text": "Option A text", "imageUrl": "optional string" }
  ],
  "correctAnswer": "string | string[] | number | { value, tolerance } | Record<string, string>",
  "explanation": "string",
  "explanationImageUrl": "string (optional)",
  "difficulty": "'easy' | 'medium' | 'hard'",
  "marks": 4,
  "negativeMarks": 1,
  "source": "string (optional e.g. JEE Main)",
  "year": 2024,
  "isPublished": true,
  "createdAt": "ISO 8601 Timestamp",
  "createdBy": "string (admin UID)"
}
```

### `tests/{testId}`
Full-length mock tests and chapter drills.
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "instructions": ["string"],
  "category": "'mock' | 'chapter_test' | 'dpp' | 'pyq' | 'custom'",
  "subjectIds": ["string"],
  "durationMinutes": 180,
  "totalMarks": 300,
  "totalQuestions": 75,
  "questions": [
    { "questionId": "q1", "section": "Physics", "order": 1, "marks": 4, "negativeMarks": 1 }
  ],
  "isPublished": true,
  "createdAt": "ISO 8601 Timestamp"
}
```

### `attempts/{attemptId}`
Student test attempt logs.
```json
{
  "id": "string",
  "testId": "string",
  "studentId": "string",
  "startedAt": "ISO 8601 Timestamp",
  "submittedAt": "ISO 8601 Timestamp (optional)",
  "durationSeconds": 10800,
  "remainingSeconds": 0,
  "status": "'in_progress' | 'submitted' | 'auto_submitted'",
  "answers": {
    "q1": {
      "questionId": "q1",
      "userAnswer": "opt_1",
      "state": "'ANSWERED' | 'MARKED_FOR_REVIEW' | ...",
      "timeSpentSeconds": 120,
      "isCorrect": true,
      "marksAwarded": 4
    }
  },
  "totalScore": 240,
  "accuracyPercentage": 85.5
}
```

---

## 2. Firestore Spark Limits & Query Efficiency Strategy
1. **Paging**: All question queries enforce `.limit(20)` with pagination cursors (`startAfter`).
2. **Indexing**: Compound indexes defined in `firestore.indexes.json` prevent in-memory sorts.
3. **Cache Policy**: Realtime `onSnapshot` listeners are avoided for listing views in favor of one-shot `getDocs` calls.
