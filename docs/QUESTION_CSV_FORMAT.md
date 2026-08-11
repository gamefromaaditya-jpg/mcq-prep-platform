# MASTER QUESTION BANK — CSV BULK IMPORT SPECIFICATION

This document outlines the standard CSV format for bulk importing questions into the MARK Exam Preparation Platform.

---

## 1. Supported CSV Columns

| Column Header | Required | Supported Values / Description | Example |
| :--- | :---: | :--- | :--- |
| `subject` | Yes | Subject ID or Subject Name | `Physics` |
| `chapter` | Yes | Chapter ID or Chapter Name | `Rotational Dynamics` |
| `type` | Yes | `single_correct`, `multiple_correct`, `integer`, `numerical`, `match` | `single_correct` |
| `question` | Yes | Full question statement | `"What is the unit of Torque?"` |
| `optionA` | Conditional | Choice text for Option A (Required for `single_correct` & `multiple_correct`) | `N-m` |
| `optionB` | Conditional | Choice text for Option B (Required for `single_correct` & `multiple_correct`) | `Joule` |
| `optionC` | Optional | Choice text for Option C | `Watt` |
| `optionD` | Optional | Choice text for Option D | `Pascal` |
| `correctAnswer` | Yes | Format depends on question `type` (See below) | `A` or `A\|C` or `5` or `12.5\|0.01` |
| `explanation` | Optional | Step-by-step solution text | `"Torque is defined as r x F"` |
| `difficulty` | Yes | `easy`, `medium`, `hard` | `medium` |
| `marks` | Yes | Positive marks integer/decimal (e.g. >= 0) | `4` |
| `negativeMarks` | Yes | Negative marking deduction (e.g. >= 0) | `1` |
| `exam` | Optional | Target exam tag | `JEE Main` |
| `year` | Optional | Exam year | `2024` |
| `source` | Optional | Citation or PYQ reference | `JEE Main 2024 Shift 1` |
| `tags` | Optional | Semi-colon separated tags | `mechanics; rotational; pyq` |
| `imageUrl` | Optional | Direct image URL for question figure | `https://.../figure1.png` |

---

## 2. Question Type Specific Format Rules

### A. Single Correct (`single_correct`)
- `optionA` and `optionB` are required.
- `correctAnswer`: Letter choice (`A`, `B`, `C`, `D`) OR option ID (`opt_1`, `opt_2`, `opt_3`, `opt_4`).
- **Example**: `correctAnswer: A`

### B. Multiple Correct (`multiple_correct`)
- `optionA` and `optionB` are required.
- `correctAnswer`: Pipe-separated list of correct choices (`A|C`, `A|B|D`).
- **Example**: `correctAnswer: A|C`

### C. Integer Type (`integer`)
- `correctAnswer`: Single integer number.
- **Example**: `correctAnswer: 5`

### D. Numerical Type (`numerical`)
- `correctAnswer`: Target value OR target value + tolerance (`value|tolerance`).
- **Example**: `correctAnswer: 12.5|0.01` or `correctAnswer: 3.14`

### E. Match Matrix (`match`)
- `correctAnswer`: Pipe-separated key:value pair mappings (`A:1|B:3|C:2`).
- **Example**: `correctAnswer: A:1|B:3|C:2`

---

## 3. Sample CSV File Content

```csv
subject,chapter,type,question,optionA,optionB,optionC,optionD,correctAnswer,explanation,difficulty,marks,negativeMarks,exam,year,source,tags
Physics,Rotational,single_correct,"What is the moment of inertia of a uniform disk of mass M and radius R about its central axis?",MR^2,1/2 MR^2,2/5 MR^2,1/12 MR^2,B,"Formula I = 1/2 MR^2 for solid disk.",medium,4,1,JEE Main,2024,Shift 1,rotational;mechanics
Chemistry,Electrochemistry,multiple_correct,"Which of the following are strong electrolytes?",HCl,NaCl,CH3COOH,NaOH,A|B|D,"HCl, NaCl, and NaOH dissociate completely in aqueous solution.",medium,4,1,JEE Main,2024,Shift 2,electrochemistry
Mathematics,Calculus,integer,"Find the number of points of local extrema for f(x) = x^3 - 3x.",,,,,,2,"f'(x) = 3x^2 - 3 = 0 => x = ±1 (2 points)",easy,4,0,NEET,2024,Chapter Test,calculus;extrema
Physics,Units,numerical,"Calculate gravitational acceleration g in m/s^2 on sea level.",,,,,,9.81|0.05,"Standard value of g = 9.80665 m/s^2",easy,4,1,JEE Main,2024,General,constants
Physics,Vectors,match,"Match Column I with Column II",,,,,,A:1|B:2|C:3,"Standard vector identity matches",hard,4,1,JEE Advanced,2023,Paper 1,vectors
```

---

## 4. Automatic Validation & Duplicate Detection Rules
1. **Row Validation**: Every row is checked for valid numbers, non-empty options, non-empty questions, and correct type syntax.
2. **In-File Duplicate Check**: If multiple rows in the same CSV file contain identical normalized question statements, duplicate rows are flagged.
3. **Master Bank Duplicate Check**: Questions matching an existing normalized fingerprint (`subjectId + normalized_text`) in Cloud Firestore are flagged.
4. **Batch Writing**: Valid rows are committed in Firestore batches of 400 documents to guarantee compliance with the 500-write limit per batch.
