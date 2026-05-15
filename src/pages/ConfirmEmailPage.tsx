import PreloginLayout from '@/components/prelogin/PreloginLayout';
import ConfirmEmailScreen from '@/components/prelogin/ConfirmEmailScreen';

export default function ConfirmEmailPage() {
  return (
    <PreloginLayout splitScreen={false}>
      <ConfirmEmailScreen />
    </PreloginLayout>
  );
}
