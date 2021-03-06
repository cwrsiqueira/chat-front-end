import React, { useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';
import { 
  Container, 
  Conteudo, 
  Header, 
  Form, 
  Campo,
  Label,
  Input,
  Select, 
  Button,
  HeaderChat,
  ImgUsuario,
  NomeUsuario,
  ChatBox,
  ConteudoChat,
  MsgEnviada,
  DetMsgEnviada,
  TextoMsgEnviada,
  MsgRecebida,
  DetMsgRecebida,
  TextoMsgRecebida,
  EnviarMsg,
  CampoMsg,
  ButtonEnviarMsg,
  Sala,
  Termos,
  Termos_title,
} from './styles/styles';

let socket;

function App() {

  const ENDPOINT = 'http://localhost:8080/';

  const [logado, setLogado] = useState(false);
  const [nome, setNome] = useState('');
  const [sala, setSala] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [listaMensagem, setListaMensagem] = useState([]);

  useEffect(() => {
    socket = socketIOClient(ENDPOINT);
  }, []);

  useEffect(() => {
    socket.on("receber_mensagem", (dados) => {
      setListaMensagem([...listaMensagem, dados]);
    });
  });

  const conectarSala = () => {
    setLogado(true);
    socket.emit("sala_conectada", sala);
  }

  const enviarMensagem = async () => {
    const conteudoMensagem = {
      sala,
      conteudo: {
        nome,
        mensagem
      }
    }

    await socket.emit("enviar_mensagem", conteudoMensagem);
    setListaMensagem([ ...listaMensagem, conteudoMensagem.conteudo]);
    setMensagem("");
  }

  return (
    <Container>
      {!logado ? 
        <Conteudo>
          <Header>TS - Then Speak</Header>
          <Form>
            <Campo>
              <Label>Nome: </Label>
              <Input type="text" placeholder="Nome" name="nome" value={nome} onChange={(t) => {setNome(t.target.value)}} />
            </Campo>
            
            <Campo>
              <Label>Sala: </Label>
              <Sala name='sala' onKeyUp={(t) => {setSala(t.target.value)}} />
              {/* <Select name="sala" onChange={(t) => {setSala(t.target.value)}}>
                <option value="">Selecione</option>
                <option value="1">Node.js</option>
                <option value="2">React.js</option>
                <option value="3">React Native</option>
                <option value="4">PHP</option>
              </Select> */}
            </Campo>

            <Button onClick={conectarSala}>Acessar</Button>
          </Form>
          <Termos_title>Aten????o! Leia antes de acessar o chat. <br/> Ao acessar voc?? concorda com os termos abaixo.</Termos_title>
          <Termos>
            <li>Esse chat n??o tem qualquer tipo de criptografia. Cuidado ao enviar informa????es sigilosas no chat.</li>
            <li>Esse chat n??o salva mensagens, depois de sair ?? imposs??vel recuperar as mensagens.</li>
            <li>Isso n??o impede prints das imagens do chat</li>
            <li>Ao acessar o chat voc?? concorda com estes termos e isenta o desenvolvedor de qualquer dano, de qualquer natureza.</li>
            <li>Voc?? declara tamb??m, ao acessoar, que ?? maior de 18 anos e ?? totalmente respons??vel por seus atos no chat.</li>
            <li>N??o aceitamos qualquer discurso de ??dio, fakenews ou discrimina????o de qualquer natureza, caso tenha alguma den??ncia denuncie nos f??rums legais.</li>
          </Termos>
        </Conteudo>
      : 
        <ConteudoChat>
          <HeaderChat>
            <ImgUsuario src="avatar.jpg" alt={nome} />
            <NomeUsuario> {sala} - {nome} - <a href="/">Sair</a> </NomeUsuario>
          </HeaderChat>
          <ChatBox>
          {listaMensagem.map((msg, key) => {
            return (
              <div key={key}>
                {nome === msg.nome ?
                  <MsgEnviada>
                    <DetMsgEnviada>
                      <TextoMsgEnviada>{msg.nome}: {msg.mensagem}</TextoMsgEnviada>
                    </DetMsgEnviada>
                  </MsgEnviada>
                : 
                <MsgRecebida>
                  <DetMsgRecebida>
                    <TextoMsgRecebida>{msg.nome}: {msg.mensagem}</TextoMsgRecebida>
                  </DetMsgRecebida>
                </MsgRecebida>
                }
              </div>
            )
          })}
          </ChatBox>
          <EnviarMsg>
            <CampoMsg type="text" name="mensagem" value={mensagem} placeholder="Mensagem..." onChange={(texto) => setMensagem(texto.target.value)} />
            <ButtonEnviarMsg onClick={enviarMensagem}>Enviar</ButtonEnviarMsg>
          </EnviarMsg>
        </ConteudoChat>
      }
    </Container>
  );
}

export default App;
