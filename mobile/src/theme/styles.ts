import {StyleSheet} from 'react-native';

export const colors = {
  background: '#f4f7fb',
  border: '#d8e0ea',
  card: '#ffffff',
  danger: '#b42318',
  dangerSoft: '#fee4e2',
  header: '#14213d',
  muted: '#64748b',
  primary: '#0f766e',
  primarySoft: '#ccfbf1',
  text: '#172033',
  warning: '#b45309',
  warningSoft: '#fef3c7',
};

export const sharedStyles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.header,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  buttonDanger: {
    backgroundColor: colors.danger,
  },
  buttonGhost: {
    backgroundColor: '#eef3f8',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  buttonTextDark: {
    color: colors.header,
    fontSize: 14,
    fontWeight: '700',
  },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  errorBox: {
    backgroundColor: colors.dangerSoft,
    borderColor: '#fda29b',
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
    lineHeight: 20,
  },
  fieldLabel: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  header: {
    backgroundColor: colors.header,
    paddingBottom: 18,
    paddingHorizontal: 20,
    paddingTop: 22,
  },
  headerEyebrow: {
    color: '#9fd8d2',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '800',
    marginTop: 4,
  },
  input: {
    backgroundColor: '#ffffff',
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.text,
    fontSize: 15,
    minHeight: 44,
    paddingHorizontal: 12,
  },
  muted: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  screenBody: {
    gap: 14,
    padding: 16,
  },
});
