"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const notes_1 = __importDefault(require("./routes/notes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const uri = process.env.ATLAS_URI;
if (uri) {
    mongoose_1.default.connect(uri)
        .then(() => console.log("MongoDB database connection established successfully"))
        .catch(err => console.log("MongoDB connection error: ", err));
}
else {
    console.error("ATLAS_URI is not defined in the environment variables");
}
app.use('/api/notes', notes_1.default);
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
