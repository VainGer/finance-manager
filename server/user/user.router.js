import Router from "express";
import { addCat, removeCat, renameCat, addItemToCat, addTransact,removeItem, renameItem } from "./user.controller.js";


const userRouter = Router();

userRouter
    .post('/add_cat', addCat)
    .post('/remove_cat', removeCat)
    .post('/add_item', addItemToCat)
    .post('/add_spend', addTransact)
    .post('/rename_cat', renameCat)
    .post('/remove_item', removeItem)
    .post('/rename_item', renameItem);

export default userRouter;
