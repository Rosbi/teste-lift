const queryString = window.location.search;
const urlParams   = new URLSearchParams(queryString);
const pedido_id   = urlParams.get("pedido_id");

main(pedido_id);

async function main(pedido_id){
    const pedidos  = await get_array("https://sistemalift1.com/lift_ps/api/Pedidos");
    const pedido   = buscar_por_id(pedidos, pedido_id);

    const itens    = await get_array("https://sistemalift1.com/lift_ps/api/ItensPedido/" + pedido.id);
    const cliente  = await get_array("https://sistemalift1.com/lift_ps/api/Clientes/" + pedido.cliente);
    const produtos = await get_array("https://sistemalift1.com/lift_ps/api/Produtos");

    let itens_do_pedido = [];
    for(let index = 0; index < itens.length; index++){
        let item    = { 'codigo_produto':0, 'nome_produto':0, 'quantidade_itemPedido':0, 'valor_total_produto':0 };
        let produto = buscar_por_id(produtos, itens[index].produto);
        let valor   = produto.valor * itens[index].quantidade;

        item.codigo_produto        = produto.id;
        item.nome_produto          = produto.nome;
        item.quantidade_itemPedido = itens[index].quantidade;
        item.valor_total_produto   = valor;

        itens_do_pedido.push(item);
    }
    
    preencher_tabela_cliente(cliente, pedido);

    for(let index = 0; index < itens_do_pedido.length; index++){
        preencher_tabela_itens(itens_do_pedido[index]);
    }
console.log(itens_do_pedido);
    const valor_total_pedido = calcular_valor_pedido(pedido.id, itens_do_pedido, produtos);
    document.getElementById("valor_total").innerText  += valor_total_pedido;
}

function preencher_tabela_cliente(cliente, pedido){
    document.getElementById("header").innerText        += " (" + pedido.id + ")";
    document.getElementById("nome_cliente").innerText  += " " + cliente.nome;
    document.getElementById("cpf_cliente").innerText   += " " + cliente.cpf;
    document.getElementById("email_cliente").innerText += " " + cliente.email;
    document.getElementById("data_pedido").innerText   += " " + pedido.data;
}

function preencher_tabela_itens(itens_do_pedido){
    let codigo       = document.createElement('td');
    codigo.innerHTML = itens_do_pedido.codigo_produto;

    let produto       = document.createElement('td');
    produto.innerHTML = itens_do_pedido.nome_produto;

    let quantidade       = document.createElement('td');
    quantidade.innerHTML = itens_do_pedido.quantidade_itemPedido;

    let valor       = document.createElement('td');
    valor.innerHTML = itens_do_pedido.valor_total_produto;

    let row = document.createElement('tr');
    row.appendChild(codigo);
    row.appendChild(produto);
    row.appendChild(quantidade);
    row.appendChild(valor);

    document.getElementById("tabela_pedido").appendChild(row);
}

/* funções de utilidade */
async function get_array(request_query){
    const request = new Request(request_query);

    let lista = [];

    await fetch(request)
        .then((resp) => resp.json())
        .then(function(data){
            lista = data;
        }).catch(function(error){
            console.log(error);
    });

    return lista;
}

function buscar_por_id(lista, id){
    for(let index = 0; index < lista.length; index++){
        if(lista[index].id == id){
            return lista[index];
        }
    }
}

function calcular_valor_pedido(pedido, lista_itens_pedido, lista_produtos){
    let preco = 0;
    for(let index = 0; index < lista_itens_pedido.length; index++){
        // if(lista_itens_pedido[index].pedido == pedido){
            let produto = buscar_por_id(lista_produtos, lista_itens_pedido[index].codigo_produto);
            preco += produto.valor * lista_itens_pedido[index].quantidade_itemPedido;
        // }
    }
    return preco;
}
