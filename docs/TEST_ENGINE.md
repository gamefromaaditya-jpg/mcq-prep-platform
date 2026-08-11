# TEST ENGINE ARCHITECTURE & SCORING SPECIFICATION

## 1. Supported Question Types & Evaluation Rules

### 1. `single_correct`
- **Evaluation**: Compares selected option ID string with correct option ID.
- **Scoring**: Full positive marks if match; deducts negative marks if mismatch; 0 if un-attempted.

### 2. `multiple_correct`
- **Evaluation**: Compares sorted array of student selected option IDs with correct array of option IDs.
- **Scoring**: Full positive marks if exact match; deducts negative marks if mismatch/incomplete.

### 3. `integer`
- **Evaluation**: Numeric equality comparison between student entered integer and key integer.
- **Scoring**: Full positive marks if exact integer match; negative marks if wrong.

### 4. `numerical`
- **Evaluation**: Range evaluation supporting tolerance window: `|userValue - targetValue| <= tolerance`.
- **Scoring**: Full positive marks if within tolerance window; negative marks if outside.

### 5. `match`
- **Evaluation**: Key-value pair equality comparison across matrix columns.
- **Scoring**: Full positive marks if all pairs match; negative marks if wrong.

---

## 2. Question Navigation States
During test execution, each question transitions through 5 distinct states:
1. `NOT_VISITED` (Gray)
2. `UNANSWERED` (Red)
3. `ANSWERED` (Green)
4. `MARKED_FOR_REVIEW` (Purple)
5. `ANSWERED_AND_MARKED` (Purple with Green badge)
