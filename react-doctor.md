Rule: react-doctor/no-array-index-as-key
Severity: warning
Category: Correctness
Count: 1

Array index "i" used as key — causes bugs when list is reordered or filtered

Suggestion: Use a stable unique identifier: `key={item.id}` or `key={item.slug}` — index keys break on reorder/filter

Files:
  src/features/clinicalProfiles/components/ClinicalProfileForm/MemberRiskFlagsSection/MemberRiskFlagCard/StatusesByZone.tsx: 71

Rule: jsx-a11y/role-has-required-aria-props
Severity: error
Category: Accessibility
Count: 1

`combobox` role is missing required aria props `aria-controls`.

Suggestion: Add missing aria props `aria-controls` to the element with `combobox` role.

Files:
  src/shared/components/SearchableCombobox/SearchableCombobox.tsx: 66
