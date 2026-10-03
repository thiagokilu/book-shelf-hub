// Script para criar usuários de teste
const testUsers = [
  {
    name: "João Silva",
    username: "joaosilva",
    email: "joao.silva@example.com",
    password: "teste123",
    bio: "Amante de livros de ficção científica"
  },
  {
    name: "Maria Santos",
    username: "mariasantos",
    email: "maria.santos@example.com",
    password: "teste123",
    bio: "Leitora de romances e poesia"
  },
  {
    name: "Pedro Oliveira",
    username: "pedrooliveira",
    email: "pedro.oliveira@example.com",
    password: "teste123",
    bio: "Fã de livros de história e biografias"
  },
  {
    name: "Ana Costa",
    username: "anacosta",
    email: "ana.costa@example.com",
    password: "teste123",
    bio: "Apaixonada por livros de autoajuda"
  },
  {
    name: "Lucas Ferreira",
    username: "lucasferreira",
    email: "lucas.ferreira@example.com",
    password: "teste123",
    bio: "Leitor de thrillers e mistérios"
  }
];

async function createUser(user) {
  try {
    const response = await fetch("https://api-books-en6a.onrender.com/sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    const data = await response.json();

    if (response.ok) {
      console.log(`✅ Usuário criado: ${user.username} (${user.name})`);
      return { success: true, username: user.username, data };
    } else {
      // Se for rate limit, extrai o tempo de espera
      if (data.message && data.message.includes("Rate limit")) {
        const match = data.message.match(/retry in (\d+) seconds/);
        if (match) {
          const waitTime = parseInt(match[1]) + 5; // +5 segundos de margem
          console.log(`⏸️ Rate limit para ${user.username}, esperando ${waitTime}s...`);
          await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
          // Tenta novamente
          return await createUser(user);
        }
      }
      console.log(`❌ Erro ao criar ${user.username}:`, data.message || "Erro desconhecido");
      return { success: false, username: user.username, error: data.message };
    }
  } catch (error) {
    console.log(`❌ Erro de conexão ao criar ${user.username}:`, error.message);
    return { success: false, username: user.username, error: error.message };
  }
}

async function createAllUsers() {
  console.log("🚀 Iniciando criação de usuários de teste...\n");

  const results = [];

  for (const user of testUsers) {
    const result = await createUser(user);
    results.push(result);
    // Delay entre requisições para evitar rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log("\n📊 Resumo:");
  const successCount = results.filter(r => r.success).length;
  const failCount = results.filter(r => !r.success).length;
  console.log(`✅ Sucesso: ${successCount}`);
  console.log(`❌ Falhas: ${failCount}`);

  if (failCount > 0) {
    console.log("\n❌ Usuários que falharam:");
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.username}: ${r.error}`);
    });
  }
}

createAllUsers();
