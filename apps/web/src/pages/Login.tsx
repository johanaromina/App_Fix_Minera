import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Eye, EyeOff, LogIn } from 'lucide-react';

interface LoginForm {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true);
      await login(data.email, data.password);
      toast.success('¡Bienvenido!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={4}>
            <Card className="card-custom">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <LogIn size={48} className="text-primary-custom mb-3" />
                  <h3 className="fw-bold">TFG Mineria</h3>
                  <p className="text-muted">Sistema de Gestión Minera</p>
                </div>

                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="usuario@empresa.com"
                      {...register('email', {
                        required: 'El email es requerido',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Email inválido',
                        },
                      })}
                      isInvalid={!!errors.email}
                    />
                    {errors.email && (
                      <Form.Control.Feedback type="invalid">
                        {errors.email.message}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Contraseña</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        {...register('password', {
                          required: 'La contraseña es requerida',
                          minLength: {
                            value: 6,
                            message: 'Mínimo 6 caracteres',
                          },
                        })}
                        isInvalid={!!errors.password}
                      />
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="position-absolute end-0 top-50 translate-middle-y me-2 border-0 bg-transparent"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </Button>
                    </div>
                    {errors.password && (
                      <Form.Control.Feedback type="invalid">
                        {errors.password.message}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>

                  <Button
                    type="submit"
                    variant="primary-custom"
                    className="w-100 mb-3"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Iniciando sesión...
                      </>
                    ) : (
                      'Iniciar Sesión'
                    )}
                  </Button>
                </Form>

                <div className="text-center">
                  <small className="text-muted">
                    ¿Problemas para acceder? Contacta al administrador
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
