const express =  require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const mysql = require("mysql")
const moment = require("moment")
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const { error } = require("console")

const app = express()
app.use(express.static(__dirname));
app.use(express.json)
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

const storage = multer.diskStorage({
    destination: (req, file, cb)=> {
        cb(null, './image')
    },
    filename: (req, file, cb) =>{
        cb(null, "image-" + Date.now() + path.extname(file.originalname))
    }
})

let upload = multer({storage:storage})

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password:"",
    database:"penyewaan"
})

db.connect(error=>{
    if(error){
        console.log(error.message)
    } else {
        console.log("Mysql connected")
    }
})

// ---------------------------------------------------------------------------- CRUD KARYAWAN -------------------------------------------------------------------------

app.post("/karyawan",(error,result)=>{
    let data = {
        nama_karyawan: req.body.nama_karyawan,
        alamat_karyawan: req.body.alamat_karyawan,
        kontak: req.body.kontak,
        username: req.body.username
    }

    let sql = "insert into karyawan set ?"

    db.query(sql,data,(error,result)=>{
        let response = null
        if(error){
            response = {
                message: error.message
            }
        } else {
            response = {
                count:result.length,
                karyawan:result
            }
        }
        res.json(response)
    })
})

app.get("/karyawan",(req,res)=>{
    let sql = "select * from karyawan"

    db.query(sql,(error,result)=>{
        let response = null
        if (error) {
            response = {
                message:error.message
            }
        } else {
            response = {
                count:result.length,
                karyawan:result
            }
        }
        res.json(response)
    })
})

app.get("/karyawan/:id",(req,res)=>{
    let data = {
       id_karyawan: req.params.id
    } 

    let sql = "select * from karyawan where ?"

    db.query(sql,data,(error,result)=>{
        let response = null
        if(error){
            response = {
                message: error.message
            }
        } else {
            response = {
                count:result.length,
                karyawan:result
            }
        }
        res.json(response)
    })
})

app.put("/karyawan",(req,res)=>{
    let data = [{
        nama_karyawan : req.body.nama_karyawan,
        alamat_karyawan : req.body.alamat_karyawan,
        kontak : req.body.kontak,
        username : req.body.username

    },
    {
        id_karyawan : req.body.id_karyawan
    }
    ]

    let sql = "update karyawan set ? where ?"

    db.query(sql,data,(error,result)=>{
        let response = null
        if(error){
            response = {
                message: error.message
            }
        } else {
            response = {
                message: result.affectedRows + " data updated "
            }
        }
        res.json(response)
    })
})

app.delete("/karyawan/:id",(req,res)=>{
    let data = {
        id_karyawan: req.params.id
    }

    let sql = "delete from karyawan where ?"

    db.query(sql,data,(error,result)=>{
        let response = null
        if(error){
            response = {
                message:error.message
            }
        } else {
            response = {
                message: result.affectedRows + "data deleted"
            }
        }
        res.json(response)
    })
})

// ------------------------------------------------------------------------------- CRUD PELANGGAN -----------------------------------------------------------------

app.post("/pelanggan",(req,res)=>{
    let data = {
        nama_pelanggan: req.body.nama_pelanggan,
        alamat_pelanggan: req.body.alamat_pelanggan,
        kontak: req.body.kontak,
        username: req.body.username
    }

    let sql = "insert into pelanggan set ?"

    db.query(sql,data,(error,result)=>{
        let response = null
        if(error){
            response = {
                message: error.message
            }
        } else {
            response = {
                count:result.length,
                pelanggan:result
            }
        }
        res.json(response)
    })
})

app.get("/pelanggan",(req,res)=>{
    let sql = "select * from pelanggan"

    db.query(sql,(error,result)=>{
        let response = null
        if (error) {
            response = {
                message:error.message
            }
        } else {
            response = {
                count:result.length,
                pelanggan:result
            }
        }
        res.json(response)
    })
})

app.get("/pelanggan/:id",(req,res)=>{
    let data = {
       id_pelanggan: req.params.id
    } 

    let sql = "select * from pelanggan where ?"

    db.query(sql,data,(error,result)=>{
        let response = null
        if(error){
            response = {
                message: error.message
            }
        } else {
            response = {
                count:result.length,
                pelanggan:result
            }
        }
        res.json(response)
    })
})

app.put("/pelanggan",(req,res)=>{
    let data = [{
        nama_pelanggan: req.body.nama_pelanggan,
        alamat_pelanggan: req.body.alamat_pelanggan,
        kontak: req.body.kontak,
        username: req.body.username

    },
    {
        id_pelanggan: req.body.id_pelanggan
    }
    ]

    let sql = "update pelanggan set ? where ?"

    db.query(sql,data,(error,result)=>{
        let response = null
        if(error){
            response = {
                message: error.message
            }
        } else {
            response = {
                message: result.affectedRows + " data updated "
            }
        }
        res.json(response)
    })
})

app.delete("/pelanggan/:id",(req,res)=>{
    let data = {
        id_pelanggan: req.params.id
    }

    let sql = "delete from pelanggan where ?"

    db.query(sql,data,(error,result)=>{
        let response = null
        if(error){
            response = {
                message:error.message
            }
        } else {
            response = {
                message: result.affectedRows + "data deleted"
            }
        }
        res.json(response)
    })
})

// ---------------------------------------------------------------------------- CRUD MOBIL ------------------------------------------------------------------

app.post("/mobil", upload.single("image"),(req,res)=>{
    let data = {
        nomor_mobil: req.body.nomor_mobil,
        merek: req.body.alamat_merek,
        jenis: req.body.jenis,
        warna: req.body.warna,
        tahun_pembuatan: req.body.tahun_pembuatan,
        biaya_sewa_per_hari: Number(req.body.biaya_perhari),
        image:  req.file.filename
    }

    if (!req.file) {
        // jika tidak ada file yang diupload
        res.json({
            message: "Tidak ada file yang dikirim"
        })
    } else {
        // create sql insert
        let sql = "insert into mobil  set ?"

        // run query
        db.query(sql, data, (error, result) => {
            if(error) throw error
            res.json({
                message: result.affectedRows + " data berhasil disimpan"
            })
        })
    }
})


app.get("/mobil",(req,res)=>{
    let sql = "select * from mobil"

    db.query(sql, (error, result) => {
        if (error) throw error
        res.json({
            data: result,
            count: result.length
        })
    })
})


app.get("/mobil/:id",(req,res)=>{
    let data = {
       id_mobil: req.params.id
    } 

    let sql = "select * from mobil where ?"

    db.query(sql,data,(error,result)=>{
        let response = null
        if(error){
            response = {
                message: error.message
            }
        } else {
            response = {
                count:result.length,
                mobil:result
            }
        }
        res.json(response)
    })
})

app.put("/mobil", upload.single("image"),(req,res)=>{

let data = null, sql = null

let param = { id_mobil: req.body._id_mobil}

 if(!req.file) {
        data = {
            nomor_mobil: req.body.nomor_mobil,
            merek: req.body.alamat_merek,
            jenis: req.body.jenis,
            warna: req.body.warna,
            tahun_pembuatan: req.body.tahun_pembuatan,
            biaya_sewa_per_hari: Number(req.body.biaya_perhari)
        }
    } else {
        data = {
            nomor_mobil: req.body.nomor_mobil,
            merek: req.body.alamat_merek,
            jenis: req.body.jenis,
            warna: req.body.warna,
            tahun_pembuatan: req.body.tahun_pembuatan,
            biaya_sewa_per_hari: Number(req.body.biaya_perhari),
            image: req.file.filename   
        }
    }

    sql = "select * from mobil where ?"

    db.query(sql,param,(err,result)=>{
        if (err) throw err

        let fileName = result[0].image

        let dir = path.join(__dirname,"image",fileName)
        fs.unlink(dir,(error)=> {})
    })

    sql = "update mobil set ? where ?"

    db.query(sql,[data,param],(error,result)=>{
        if(error){
            res.json =({
                message: error.message
            })
        } else {
            res.json = ({
                message: result.affectedRows + " data updated "
            })
        }
        res.json(response)
    })
})

app.delete("/mobil/:id",(req,res)=>{
    let param = {id_mobil: req.params.id_mobil}

    let sql = "select * from mobil where ?"

    db.query(sql,param,(error,result)=>{
        if (error) throw error

        let fileName = result[0].image

        let dir = path.join(__dirname,"image",fileName)
        fs.unlink(dir,(error)=>{})
    })

    sql = "delete from mobil where ?"

    db.query(sql,param,(error,result)=>{
        if(error){
            res.json =({
                message: error.message
            })
        } else {
            res.json = ({
                message: result.affectedRows + " data deleted "
            })
        }
        res.json(response)
    })
})

// ---------------------------------------------------------------------------- TRANSAKSI SEWA ---------------------------------------------------------

app.post("/sewa",(req,res)=>{

    var id = {
        id_mobil: req.body.id_mobil
    }
    let ssewa = "select @ssewa := biaya_sewa_per_hari from mobil where ?"

    let data =  
    {
        id_mobil: req.body.id_mobil,
        id_karyawan: req.body.id_karyawan,
        id_pelanggan: req.body.id_pelanggan,
        tgl_sewa: moment().format('YYYY-MM-DD HH:mm:ss'),
        tgl_kembali: req.body.tgl_kembali,
        total_bayar: ssewa * (tgl_kembali - tgl_sewa)
    }     

        let sql = "insert into sewa set ?"

        db.query(sql,id,data,(error,result)=>{
            if(error){
                res.json({message: error.message})
            } else {
                res.json({message:"data has been inserted"})
            }
        })

})

app.get("sewa",(req,res)=>{
    
    let sql = "select "
})