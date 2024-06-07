import { Link } from 'react-router-dom';
import logo from 'src/assets/images/logos/logo-sidebar2.png';
import { styled } from '@mui/material';

const LinkStyled = styled(Link)(() => ({
  overflow: 'hidden',
  display: 'flex',
  alignItems:"center",
  justifyContent:"center",
}));

const Logo = () => {
  return (
    <LinkStyled to="/Pioche">
      <img src={logo} alt="Logo" height={100} />
    </LinkStyled>
  )
};

export default Logo;
