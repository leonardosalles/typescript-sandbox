# Expect Dev Instructions

You can use any Agent to execute the skill to test the app, for example:

```
expect-cli -m "Test the signup flow end-to-end. Try to click Continue/Next on each step with empty fields to confirm validation blocks progress and shows errors. On Account step: use invalid email, then valid email; use password shorter than 8; use mismatched confirm password; try without accepting terms; then fix all and proceed. On Profile step: leave names empty; use invalid username with spaces/symbols; leave role empty; verify errors; then fix with valid values and proceed. On Plan step: select different plans and confirm selection changes; proceed. On Confirm step: verify summary values match what was entered, and that Create account completes and shows success screen. Ensure Back works where enabled and no console errors appear on http://localhost:5173" -y --cookies
```
