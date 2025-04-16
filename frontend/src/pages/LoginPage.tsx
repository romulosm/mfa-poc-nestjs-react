import {
  Button,
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Title,
  Modal,
  Group,
  Stack,
  Container,
  Center,
  CopyButton,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import { IconCopy, IconCheck } from "@tabler/icons-react";
import { useState } from "react";
import axios from "axios";

export default function LoginPage() {
  const [email, setEmail] = useState("teste@email.com");
  const [password, setPassword] = useState("123456");
  const [mfaCode, setMfaCode] = useState("");
  const [token, setToken] = useState("");

  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:3000/auth/login", {
        email,
        password,
      });

      const { access_token, mfaEnabled } = res.data;
      localStorage.setItem("access_token", access_token);
      setToken(access_token);

      setError("");

      if (mfaEnabled) {
        setShowVerifyModal(true);
      } else {
        const setupRes = await axios.post(
          "http://localhost:3000/auth/mfa/setup",
          {},
          {
            headers: { Authorization: `Bearer ${access_token}` },
          }
        );

        setQrCode(setupRes.data.qrCode);
        setSecret(setupRes.data.secret);
        setShowSetupModal(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao fazer login");
    }
  };

  const handleVerifyMfa = async () => {
    try {
      await axios.post(
        "http://localhost:3000/auth/mfa/verify",
        { code: mfaCode },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setShowVerifyModal(false);
      setShowSetupModal(false);
      window.location.href = "/me";
    } catch (err) {
      setError("Código inválido");
    }
  };

  return (
    <Center style={{ height: "100vh" }}>
      <Container size="xs">
        <Paper shadow="md" p="xl" radius="md" withBorder>
          <Title order={2} style={{ textAlign: "center" }} mb="md">
            Login com MFA
          </Title>

          <Stack>
            <TextInput
              label="E-mail"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <PasswordInput
              label="Senha"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button fullWidth mt="sm" onClick={handleLogin}>
              Entrar
            </Button>

            {error && <Text color="red">{error}</Text>}
          </Stack>
        </Paper>

        {/* Modal de setup MFA */}
        <Modal
          opened={showSetupModal}
          onClose={() => setShowSetupModal(false)}
          title="Configure sua autenticação MFA"
          centered
        >
          <Stack>
            <Text>Escaneie o QR Code abaixo no Google Authenticator:</Text>

            <Paper withBorder shadow="xs" p="md" radius="md">
              <Center mb="sm">
                <img
                  src={qrCode}
                  alt="QR Code"
                  style={{ maxWidth: 180, borderRadius: 8 }}
                />
              </Center>

              <Text size="sm" c="dimmed">
                Ou use o código manual:
              </Text>

              <Group justify="space-between" wrap="nowrap">
                <Text
                  fw={500}
                  size="sm"
                  style={{
                    fontFamily: "monospace",
                    wordBreak: "break-word",
                    flex: 1,
                  }}
                >
                  {secret}
                </Text>

                <CopyButton value={secret} timeout={2000}>
                  {({ copied, copy }) => (
                    <Tooltip label={copied ? "Copiado!" : "Copiar"} withArrow>
                      <ActionIcon
                        color={copied ? "teal" : "gray"}
                        onClick={copy}
                      >
                        {copied ? (
                          <IconCheck size="1rem" />
                        ) : (
                          <IconCopy size="1rem" />
                        )}
                      </ActionIcon>
                    </Tooltip>
                  )}
                </CopyButton>
              </Group>
            </Paper>

            <TextInput
              label="Digite o código MFA"
              placeholder="Ex: 123456"
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value)}
            />

            <Group justify="flex-end" mt="md">
              <Button onClick={handleVerifyMfa}>Verificar</Button>
            </Group>
          </Stack>
        </Modal>

        {/* Modal de verificação MFA */}
        <Modal
          opened={showVerifyModal}
          onClose={() => setShowVerifyModal(false)}
          title="Digite seu código MFA"
          centered
        >
          <Stack>
            <TextInput
              label="Código MFA"
              placeholder="Ex: 123456"
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value)}
            />

            <Group justify="flex-end" mt="md">
              <Button onClick={handleVerifyMfa}>Verificar</Button>
            </Group>
          </Stack>
        </Modal>
      </Container>
    </Center>
  );
}
