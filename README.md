# Working Days Validator

## **Lista de conteúdo**

- [Introdução](#introdução)
- [Instalação](#instalação)
- [Autenticação](#autenticação)
- [Formatos de Data](#formatos-de-data)
- [Feriados](#feriados)
  - [Consultando datas](#consultando-datas)
  - [Inserindo datas](#inserindo-datas)
  - [Deletando datas](#deletando-datas)
  - [Alterando datas](#alterando-datas)
- [Validação](#validação)

## **Introdução**

API de validação de dias úteis incluindo a manipulação de datas comemorativas, como feriados nacionais e facultativos.

## **Instalação**

Para executar a aplicação, é necessário ter o [Node.js](https://nodejs.org/en/download/) instalado no ambiente de execução. <br><br>
No diretório do projeto, em linha de comando, instale as dependência do projeto com `npm install`:

```console
$ npm install
```

Execute a aplicação com o comando `npm start`:

```console
$ npm start
```

## **Autenticação**

Para realizar as requisições nos endpoints da API, é necessário se autenticar passando no cabeçalho da requisição um token fixo precedido da palavra 'Bearer'. O token é alcançado através da codificação da palavra passe 'Claravista@2022' utilizando `base64`.<br>
É recomendável utilizar o método `btoa()`, nativo do JavaScript, que codifica `utf-16` para `base64`:

```javascript
btoa("exemplo");
// 'ZXhlbXBsbw=='
```

No cabeçalho da requisição teríamos algo parecido com:

```javascript
{
  Authorization: `Bearer ${btoa("Claravista@2020")}`;
}
```

## **Formatos de Data**

As datas são validadas na aplicação utilizando a expressão regular `/^(\d{2})[-/](\d{2})([-/](\d{4}))?$/`. Sendo assim, as datas aceitas podem conter apenas dia e mês (`dd-mm` ou `dd/mm`) ou dia, mês e ano (`dd-mm-yyyy` ou `dd/mm/yyyy`). <br>
Exemplos de algumas datas válidas e inválidas:

![Valid](https://img.shields.io/badge/-VALID-success)

- 01-01-2022
- 01-01
- 01/01/2022
- 01/01

![Invalid](https://img.shields.io/badge/-INVALID-critical)

- 01-01-22
- 01-01-
- 2022-01-01
- 01/01/22
- 01/01/
- 2022/01/01

## **Feriados**

Para a manipulação de feriados, foram desenvolvidas rotas de `GET`, `POST`, `PUT` e `DELETE`, onde as datas podem ser consultados, inseridas, alteradas e deletadas.
<br>

### Consultando datas

![GET](https://img.shields.io/badge/-GET-blue) <br>
Para obter uma listagem de todas as datas presentes na aplicação, basta realizar uma chamada `GET` para o endpoint **_`/holidays`_**. <br>
Alguns parâmetros são aceitos para filtrar a busca de datas, sendo eles os parâmetros **`day`**, **`month`** e **`year`** que podem ser informados como _query params_ na URL. Como exemplo, se quisermos listar todos os feriados do mês de novembro de 2022 podemos efetuar a requisição passando os seguintes parâmetros: <br>

- `/holidays?month=11&year=2022`

Sendo assim, obteremos uma resposta semelhante ao objeto abaixo:

```json
[
  {
    "day": 2,
    "month": 11,
    "year": null,
    "date": "02/11",
    "description": "Finados",
    "id": "6388c8cae77237787303f2b8"
  },
  {
    "day": 15,
    "month": 11,
    "year": null,
    "date": "15/11",
    "description": "Proclamação da República",
    "id": "6388c8cae77237787303f2b9"
  }
]
```

Percebe-se que mesmo especificando o ano de 2022 na busca, as datas que foram registradas sem esse dado foram retornadas, pois elas são consideradas em todos os anos.

### Inserindo datas

![POST](https://img.shields.io/badge/-POST-brightgreen)

Para inserir uma data na aplicação, é necessário realizar uma chamada `POST` para o endpoint **_`/holidays`_** passando um `JSON` no corpo da requisição com os atributos **`date`** e **`description`**. <br><br>
Caso queira inserir uma data que será considerada para todos os anos, você deve omitir o ano no valor informado no campo `date` e obedecer o formado `dd-mm` ou `dd/mm`.

```json
{
  "date": "25/12",
  "description": "Natal"
}
```

No caso de uma data que será considerada apenas em um ano específico, ela deve obedecer o formato `dd-mm-yyyy` ou `dd/mm/yyyy`.

```json
{
  "date": "15/04/2022",
  "description": "sexta feira santa"
}
```

Em caso de sucesso, será obtido uma resposta com _status code `201`_ e um objeto JSON do registro criado.

```json
{
  "day": 15,
  "month": 4,
  "year": 2022,
  "date": "15/04/2022",
  "description": "sexta feira santa",
  "createdAt": "2022-12-01T19:38:41.183Z",
  "updatedAt": "2022-12-01T19:38:41.183Z",
  "id": "638902c1bd015b3c5420b3fb"
}
```

### Deletando datas

![DELETE](https://img.shields.io/badge/-DELETE-red)

Para deletar uma data na aplicação, é necessário realizar uma requisição `DELETE` para o endpoint **_`/holidays/:id`_** passando o `id` da data cadastrada, que é obtido [consultando datas](#consultando-datas), como descrito acima. <br>

- `/holidays/6387c0689115340b43fc8fc8`

Em caso de sucesso, será obtido uma resposta com _status code `200`_ e um objeto JSON do registro deletado.

## Alterando datas

![PUT](https://img.shields.io/badge/-PUT-orange)

Para alterar uma data na aplicação, é necessário realizar uma chamada `PUT` para o endpoint **_`/holidays/:id`_** passando o `id` da data cadastrada, que é obtido [consultando datas](#consultando-datas), como descrito acima, e um JSON no corpo da requisição contendo unico e obrigatóriamente o campo **`description`**. <br>

- `/holidays/638902c1bd015b3c5420b3fb`

```json
{
  "description": "Sexta-feira Santa"
}
```

Esse tipo de operação, só permite alterações na descrição da data. <br>
Em caso de sucesso, será obtido uma resposta com _status code `200`_ e um JSON do objeto alterado.

```json
{
  "day": 15,
  "month": 4,
  "year": 2022,
  "date": "15/04/2022",
  "description": "Sexta-feira Santa",
  "createdAt": "2022-12-01T19:38:41.183Z",
  "updatedAt": "2022-12-01T19:39:27.123Z",
  "id": "638902c1bd015b3c5420b3fb"
}
```

## **Validação**

A rota de validação permite consultar se uma determinada data é um dia útil ou não. A API irá verificar se na data informada existe algum feriado previamente inserido na base de dados ou se a data simplesmente cairá em um final de semana (sábado ou domingo). <br>

### Validando Datas

![GET](https://img.shields.io/badge/-GET-blue)

Por padrão, a API valida apenas dias úteis, invalidando datas que caem em finais de semana. Para incrementar feriados na validação, é necessário informar o parâmetro **`holidays=true`**. <br>
Para obter a validação de uma data, é necessário informá-la como _query param_ na URL através do atributo **`date`**, obedecendo os [formatos válidos](#formatos-de-data). Exemplo, verificando se a data 15/04/2022 é um dia útil. <br>

- `/validate?date=15-11-2022&holidays=true` <br>

Nesse cenário, obteremos o seguinte retorno:

```json
{
  "valid": false,
  "description": "Sexta-feira Santa"
}
```

A data acima foi cadastrada anteriormente apenas para o ano de 2022, logo, se buscarmos o mesmo dia e mês para o ano anterior (2021) o resultado esperado será diferente.

- `/validate?date=15-11-2021&holidays=true`

```json
{
  "valid": true
}
```

Se o ano da data informada for omitido, a API irá considerar o ano vigente do momento da requisição. No cenário acima, omitir a data nas requisições nos traria o mesmo resultado do primeiro exemplo, considerando o ano vigente como 2022.
