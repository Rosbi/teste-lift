main();

async function main(){
    const pedidos      = await get_array("https://sistemalift1.com/lift_ps/api/Pedidos");
    const itens_pedido = await get_array("https://sistemalift1.com/lift_ps/api/ItensPedido");
    const clientes     = await get_array("https://sistemalift1.com/lift_ps/api/Clientes");
    const produtos     = await get_array("https://sistemalift1.com/lift_ps/api/Produtos");

    let valores = [];
    for(let index = 1; index <= pedidos.length; index++){
        let valor = calcular_valor_pedido(index, itens_pedido, produtos);
        valores.push({'pedido': index, 'valor': valor});
    }

    let lista_pedidos = [];
    for(let index = 0; index < pedidos.length; index++){
        
        let pedido = {'codigo_pedido':0, 'nome_cliente':0, 'data_pedido':0, 'valor_pedido':0};
        let cliente = buscar_por_id(clientes, pedidos[index].cliente);
        
        pedido.codigo_pedido = pedidos[index].id;
        pedido.nome_cliente  = cliente.nome;
        pedido.data_pedido   = pedidos[index].data;
        pedido.valor_pedido  = valores[index].valor;

        lista_pedidos.push(pedido);
    }

    for(let index = 0; index < lista_pedidos.length; index++){
        preenchar_tabela(lista_pedidos[index]);
    }
}

function preenchar_tabela(pedido){
    let codigo       = document.createElement('td');
    codigo.innerHTML = pedido.codigo_pedido;
    codigo.onclick   = function(){
        location.href="./pedido/pedido.html?pedido_id="+pedido.codigo_pedido;
    }

    let cliente       = document.createElement('td');
    cliente.innerHTML = pedido.nome_cliente;

    let data       = document.createElement('td');
    data.innerHTML = pedido.data_pedido;

    let valor       = document.createElement('td');
    valor.innerHTML = pedido.valor_pedido;

    let table_row = document.createElement('tr');
    table_row.appendChild(codigo);
    table_row.appendChild(cliente);
    table_row.appendChild(data);
    table_row.appendChild(valor);

    document.getElementById("tabela_pedidos").appendChild(table_row);
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
        if(lista_itens_pedido[index].pedido == pedido){
            let produto = buscar_por_id(lista_produtos, lista_itens_pedido[index].produto);
            preco += produto.valor * lista_itens_pedido[index].quantidade;
        }
    }
    return preco;
}
