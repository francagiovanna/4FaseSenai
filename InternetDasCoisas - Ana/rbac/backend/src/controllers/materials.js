import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../config/database.js";

export async function list(req, res) {
    const[rows] = await db.query("SELECT id, name category FROM materials");
    return res.json(rows);

}

export async function deleta(req, res) {
    const id = Number(req.params.id);

    if(!Number(id) <= 0){
        return res.status(400).json({massage: "ID Inválido"})
    }

    const [result] = await db.query("DELET FROM materials WHERE id = ?", [id]);

    if(!result.affectedRows){
        return res.status(404).json({message: "MAterial não encontrado."})
    }

    return res.status(204).end();
}