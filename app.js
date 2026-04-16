const express = require("express");
const app = express();

app.use(express.json());

let personajes = [];
let nextId = 1;

app.post("/personajes", (req, res) => {
  const { nombre, colorPiel, raza, fuerza, agilidad, magia, conocimiento } = req.body;

  if (!nombre || !colorPiel || !raza ||
      fuerza === undefined || agilidad === undefined ||
      magia === undefined || conocimiento === undefined) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  const nuevo = {
    id: nextId++,
    nombre,
    colorPiel,
    raza,
    fuerza: Number(fuerza),
    agilidad: Number(agilidad),
    magia: Number(magia),
    conocimiento: Number(conocimiento)
  };

  personajes.push(nuevo);
  res.status(201).json(nuevo);
});

app.get("/personajes", (req, res) => res.json(personajes));

app.get("/personajes/:id", (req, res) => {
  const p = personajes.find(x => x.id == req.params.id);
  if (!p) return res.status(404).json({ error: "No encontrado" });
  res.json(p);
});

app.put("/personajes/:id", (req, res) => {
  const p = personajes.find(x => x.id == req.params.id);
  if (!p) return res.status(404).json({ error: "No encontrado" });

  Object.assign(p, req.body);
  res.json(p);
});

app.delete("/personajes/:id", (req, res) => {
  personajes = personajes.filter(x => x.id != req.params.id);
  res.json({ mensaje: "Eliminado" });
});

function puntaje(p){
  return p.fuerza*2 + p.agilidad*1.5 + p.magia*2 + p.conocimiento;
}

app.post("/batalla", (req, res) => {
  const { personaje1Id, personaje2Id } = req.body;

  const p1 = personajes.find(x => x.id == personaje1Id);
  const p2 = personajes.find(x => x.id == personaje2Id);

  if (!p1 || !p2) return res.status(404).json({ error: "Personajes no encontrados" });

  const s1 = puntaje(p1);
  const s2 = puntaje(p2);

  let ganador = "Empate";
  if (s1 > s2) ganador = p1.nombre;
  else if (s2 > s1) ganador = p2.nombre;

  res.json({ p1: {nombre:p1.nombre, puntaje:s1}, p2:{nombre:p2.nombre, puntaje:s2}, ganador });
});

app.listen(3000, () => console.log("http://localhost:3000"));
