type SuccessScreenProps = {
  email: string;
};

export function SuccessScreen({ email }: SuccessScreenProps) {
  return (
    <div data-testid="success-screen" className="rf-success">
      <div className="rf-successBadge">✓</div>

      <h2 className="rf-successTitle">You're all set!</h2>

      <p className="rf-successText">
        A confirmation email has been sent to <strong>{email}</strong>.
      </p>

      <button
        data-testid="go-to-dashboard"
        onClick={() => window.location.reload()}
        className="rf-primaryButton"
      >
        Go to dashboard
      </button>
    </div>
  );
}
