# CLOUD FIRESTORE DATABASE MODEL DOCUMENTATION

## 1. Primary Collections Schema

### `subjects/{subjectId}`
Stores curriculum subject taxonomies managed by Admins.
```json
{
  "id": "string",
  "name": "string",
  "code": "string",
  "description": "string (optional)",
  "displayOrder": 1,
  "isActive": true,
  "createdAt": "ISO 8601 Timestamp",
  "updatedAt": "ISO 8601 Timestamp",
  "createdBy": "string (admin UID)"
}
```

### `chapters/{chapterId}`
Stores chapter topics linked to subjects.
```json
{
  "id": "string",
  "subjectId": "string",
  "name": "string",
  "code": "string",
  "description": "string (optional)",
  "displayOrder": 1,
  "isActive": true,
  "createdAt": "ISO 8601 Timestamp",
  "updatedAt": "ISO 8601 Timestamp",
  "createdBy": "string (admin UID)"
}
```

### `questions/{questionId}`
Master Question Bank collection managed exclusively by Admins.
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
  "exam": "string (optional)",
  "year": 2024,
  "tags": ["string"],
  "isPublished": true,
  "createdAt": "ISO 8601 Timestamp",
  "updatedAt": "ISO 8601 Timestamp",
  "createdBy": "string (admin UID)"
}
```

---

## 2. Answer Key Protection & Student Security Design
- **Admin Authoring**: Admins have full access to `questions/{questionId}` including `correctAnswer` and `explanation`.
- **Student Exam Delivery**: When a test is delivered to a student, student attempts fetch test question structures without embedding answer keys until test completion or auto-submission.
- **Rules Isolation**: `firestore.rules` restricts write mutations on `questions`, `subjects`, and `chapters` exclusively to `request.auth` credentials matching `role == 'admin'`.

---

## 3. Firestore Spark Limits & Query Efficiency Strategy
1. **Paging**: All question bank queries enforce `.limit(15)` with cursor pagination (`startAfter`).
2. **Indexing**: Compound indexes defined in `firestore.indexes.json` prevent in-memory sorts.
3. **Batch Writes**: CSV bulk import writes in chunks of 400 documents using `writeBatch(db)` to respect the 500-write limit per batch.
