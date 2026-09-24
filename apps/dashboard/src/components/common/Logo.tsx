import logoLight from '@/assets/logo-light.png';
import logoDark from '@/assets/logo-dark.png';

function Logo() {
  return (
    <div className="w-10 h-10">
      <img src={logoDark} alt="Logo" className="block dark:hidden w-full h-full object-contain" />

      <img src={logoLight} alt="Logo" className="hidden dark:block w-full h-full object-contain" />
    </div>
  );
}

export default Logo;
