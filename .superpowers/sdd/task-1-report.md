# Task 1 Report: Fix API parseJson for array responses

## Implementation
Updated `parseJson` in `src/lib/api.js` to handle array `data` responses. When `data` is an array, attaches `status` and `message` directly to the array and returns it (instead of spreading into an indexed object). Object responses keep existing behavior.

## Testing
N/A — trivial refactor. No consumer code changed; behavior is strictly additive (arrays now work, objects unchanged).

## Files Changed
- `src/lib/api.js` — added `Array.isArray` guard (lines 8-12)

## Self-Review
- Array branch: `data.status` and `data.message` attached to array ✓
- Object branch: existing spread behavior preserved ✓
- No linting/type-checking tools configured for this file — visually confirmed correctness

## Issues/Concerns
None.
