const User = require('../model/user')
const pdf = require('pdf-poppler');
const path = require('path')
const fs = require('fs')
//const gm = require('gm') // currently not using this pack
const compressing = require('compressing');


module.exports.get_Try = (req, res) => {

    try{
        res.status(200).render('mainPage')

    } catch(err)
    {
        console.log(err);
        res.status(400).send({status:"Error",msg:err});
    }
    

}

module.exports.post_uploadPreview = async (req, res) => {

    const fileData = req.file
    console.log(fileData)

    try{
        if (fileData) {


            let file = fileData.path
    
            // const previewFile = fs.readdirSync(`public/files/${fileData.originalname}`)
            // console.log(previewImage)
            
    
        //    res.render('temppdfreaderdemo',{url:`files/${fileData.originalname}`})
    
            // await fs.mkdirSync(`public/files/tempDir/${fileData.originalname}`)
    
            // let opts = {
            //     format: 'jpg',
            //     out_dir: `public/files/tempDir/${fileData.originalname}`,
            //     out_prefix: path.basename(file, path.extname(file)),
            //     page: 1,
            // }
    
            // const info = await pdf.info(file)
            // console.log(info)
    
            // await pdf.convert(file, opts)                             // CONVERTING PDF TO IMAGE 
            //     .then(res => {
    
            //         console.log('Successfully converted' + res);
            //     })
            //     .catch(error => {
            //         console.error(error + ' i am the file conversion from pdf to image error');
            //     })
    
            // const pagewidth = info.width_in_pts;
            // const pageHeight = info.height_in_pts
    
    
            // // RESIZE THE IMAGE FOR THUMBNAIL FOR IMAGE PREVIEW -- WILL CONTINUE TO DO
    
            
    
    
            // fs.rmSync(`public/files/${fileData.originalname}`)
            //   res.status(200).send({file:previewImage[0]})
        //   res.locals.url = `files/${fileData.originalname}`
            res.status(200).json({ originalname: `${fileData.originalname}`})
    
        }
    
        
    }catch(err)
    {
        console.log(err)
        res.status(400).json({err});
    }

    



    // res.status(200).send({ message: 'Got it' })




}


module.exports.post_upload = async (req, res) => {

    

    console.log(req.file)
    const fileData = req.file;
    console.log(fileData)
    const fileformat = JSON.parse(JSON.stringify(req.body));
    console.log(fileformat)
    console.log(fileformat.fileFormat)
    
    console.log('i am printed after or before the fileData')
    // console.log(fileformat)



    try {
        const savedUser = await User.create({

            fileOriginalName: fileData.originalname,
            mimeType: fileData.mimetype,
            destinationPath: fileData.path,
            size: fileData.size
        })

        console.log(savedUser)
        try {
            const dbUpdate = await User.findByIdAndUpdate(savedUser._id, { tempFilePath: `public/files/${savedUser._id}` }, { new: true })
            console.log(dbUpdate)
        } catch (err) {
            console.log(err + 'i am the database error')
        }

        //CREATION OF THE DIRECTORY FOR THE CONVERTED IMAGE FILES

        fs.mkdirSync(`public/files/${savedUser._id}`)    // CREATING THE DIRECTORY FOR STORING THE IMAGE FILES

        // FOR FILE CONVERSION TO PNG
        let file = savedUser.destinationPath
        console.log(savedUser._id)




        await pdf.info(file)                        // CONSOLE LOG THE FILE INFORMATION WHICH I S NOT REQUIRED TO LOG REMOVE WHILE DEPLOYMENT
            .then(pdfinfo => {
                console.log(pdfinfo);
            });
        let opts = {
            format: `${fileformat.fileFormat}`.toLowerCase(),
            out_dir: `public/files/${savedUser._id}`,
            out_prefix: path.basename(file, path.extname(file)),
            page: null,
        }



        await pdf.convert(file, opts)                             // CONVERTING PDF TO IMAGE 
            .then(res => {

                console.log('Successfully converted' + res);
            })
            .catch(error => {
                console.error(error + ' i am the file conversion from pdf to image error');
            })






        await compressing.tar.compressDir(`public/files/${savedUser._id}`, `public/files/${savedUser._id}.tar`)    // COMPRESSING THE IMAGES TO .tar EXTENSION
            .then(async () => {
                console.log('SUCCESSFULLY COMPRESSED THE FILE')
                await fs.rmSync(`public/files/${savedUser._id}`, { recursive: true, force: true })             // REMOVING THE DIRECTORY CREATED DOR STORING THE IMAGES AFTER CONVERSION FROM PDF
                await fs.rmSync(`public/files/${savedUser.fileOriginalName}`) // REMOVING THE ORIGINAL FILE
            })
            .catch(err => { console.log(err + 'i am the remove file error') });
        


        // fs.rmdirSync('')
        res.status(200).send({message:'SUCCESS'})

    } catch (err) {
        console.log(err)
        res.status(400).send({Error:err})
    }














}




//  THIS IS ABOUT PDF TO IMAGE ------ WILL ADD SOME MORE FEATURES AFTER MAKING THE FRONTEND