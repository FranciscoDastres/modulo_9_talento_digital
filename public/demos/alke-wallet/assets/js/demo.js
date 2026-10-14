// Ejemplo local para revisar el proyecto sin crear una cuenta.
(() => {
  const email = "visita@example.test";
  function openExample(reset = false) {
    const users = billetera.getUsers();
    let user = billetera.findUser(email);
    if (!user || reset) {
      user = {
        id: "modulo9-wallet-example", name: "Visitante de ejemplo", email,
        passwordHash: billetera.hashPassword("DemoWallet123"), saldo: 25000,
        contacts: [
          { id: "example-contact-1", nombre: "Ana de ejemplo", alias: "ana.demo", cbu: "123456789012", banco: "BancoEstado" },
          { id: "example-contact-2", nombre: "Luis de ejemplo", alias: "luis.demo", cbu: "987654321098", banco: "Banco de Chile" },
        ],
        transactions: [{ id: "example-opening", tipo: "ingreso", monto: 25000, descripcion: "Saldo inicial de ejemplo", fecha: new Date().toISOString() }],
      };
      const others = users.filter(item => item.email !== email);
      billetera.saveUsers([...others, user]);
    }
    billetera.setCurrentUser(user);
    window.location.href = "menu.html";
  }
  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("enter-wallet-demo")?.addEventListener("click", () => openExample());
    document.getElementById("reset-wallet-demo")?.addEventListener("click", () => openExample(true));
  });
})();
