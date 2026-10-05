# Naive string search

[English](README.md) | [한국어](README.ko-KR.md)

Align the pattern at each candidate position and compare characters left to right. A mismatch moves the entire pattern one position forward and starts comparison again. Return the first matching index, or `-1` when absent. An empty pattern matches at index `0`.

For text length `n` and pattern length `m`, worst-case time is `O(nm)` with `O(1)` extra space. The implementation and visualization use JavaScript UTF-16 code units and indices, matching `String.indexOf`. The optional step callback records comparisons and shifts without changing the returned result.
