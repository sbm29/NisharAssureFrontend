
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/'); // Redirect to dashboard
  }, [navigate]);

  return null;
};

export default Index;
