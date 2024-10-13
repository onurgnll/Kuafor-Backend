const CustomError = require("../errors/CustomError");
const bcrypt = require("bcrypt");
const { Admin, Municipality, Shelter, City , District, User, PetType } = require("../models");
const Response = require("../responses/response");
const { generateAccessToken, generateRefreshToken } = require("../helpers/token");
const { Op, where } = require("sequelize");
const { pagination } = require("../helpers/pagination");



const login = async (req, res, next) => {

    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({
            where: {
                [Op.or]: [
                    {
                        email: email,
                    },
                ],
            },
        });

        // Kullanıcı yoksa hata döndür
        if (!admin) {
            return res.status(404).json(new Response(-1, null, "Böyle bir kullanıcı bulunamadı"));
        }

        // Şifreyi karşılaştır
        const passwordMatch = await bcrypt.compare(password, admin.password);

        // Şifre uyuşmazsa hata döndür
        if (!passwordMatch) {
            return res.status(404).json(new Response(-1, null, "Yanlış şifre"));
        }

        // AccessToken oluştur ve kullanıcıya atama
        const token = {
            accessToken: generateAccessToken(admin.id),
            refreshToken: generateRefreshToken(admin.id)
        }
        await Admin.update(
            {
                accessToken: token.accessToken,
                refreshToken: token.refreshToken
            },
            {
                where: { id: admin.id },
            }
        );

        // Güncellenmiş kullanıcıyı al ve şifre, accessToken alanlarını hariç tut
        const updatedUser = await Admin.findOne({
            where: {
                id: admin.id,
            },
            attributes: { exclude: ['password', 'accessToken', "refreshToken"] }
        });

        // Başarılı yanıt döndür
        res.status(200).json(new Response(1, { user: updatedUser, token }, "success"));
    } catch (error) {
        console.error(error);
        next(new CustomError())
    }
};


const setApproved = async (req, res, next) => {
    try {

        const { municipalityID, approved } = req.body

        await Municipality.update({ isApproved: approved }, { where: { id: municipalityID } })

        res.status(200).json(new Response(1, {}, "success"));

    } catch (error) {
        console.error(error);
        next(new CustomError())

    }
}


const getMunicipalities = async (req, res, next) => {
    try {

        const {approveStatus} = req.body
        const page = req.query.page ? req.query.page : 1;
        const per_page = 10;

        const munics = await Municipality.findAll({

            limit: per_page,
            offset: (page - 1) * per_page,
            where: {
                isApproved: approveStatus
            },
            include:[
                
                {
                    model: Shelter,
                    as: "shelters"
                },
                {
                    model: City,
                    as: "city"
                },
                {
                    model: District,
                    as: "district"
                }
            ]
        })

        const count = await Municipality.count({})


        const paginatedMunics = pagination({
            data: munics,
            count,
            page,
            per_page,
        });

        return res.status(200).json(new Response(1, { municipalities: paginatedMunics }, "success"));


    } catch (error) {

        console.error(error);
        next(new CustomError())
    }
}


const deleteMunicipality = async (req,res,next) => {
    
    try {
        const {municipalityID} = req.params

        await Municipality.destroy({
            where: {
                id: municipalityID
            }
        })
        
        return res.status(200).json(new Response(1, {}, "success"));
    } catch (error) {
        console.error(error);
        next(new CustomError())
    }
}


const getUsers = async (req, res, next) => {
    try {
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const per_page = 10;

        const users = await User.findAll({
            limit: per_page,
            offset: (page - 1) * per_page,
            attributes: { exclude: ['password', 'accessToken', 'refreshToken'] }
        });

        const count = await User.count()
          
        const totalPages = Math.ceil(count / per_page);

        res.status(200).json({
            status: 1,
            data: {
                users,
                pagination: {
                    totalItems: count,
                    totalPages: totalPages,
                    currentPage: page
                }
            },
            message: "success"
        });
    } catch (error) {
        console.error(error);
        next(new CustomError('Kullanıcılar alınırken bir hata oluştu.'));
    }
};

const deleteUser = async (req,res,next) => {
      
    try {
        
          const { id } = req.body
          
          const user = await User.findOne({
            where:{
                id: id
            }
          })

          if (!user) {
              return res.status(404).json(new Response(-1,"Bu idde bir kullanıcı bulunamadı", "error"))
          }

          await User.destroy({
            where: {id: id}
          })

          return res.status(200).json(new Response(1, {}, "success"))
 

    } catch (error) {
        console.error(error)
        next(new CustomError())
    }
}

const searchUser = async (req, res, next) => {
    try {
        const { name, email, phoneNumber, districtName, cityName } = req.query; 
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const per_page = 10;
        let cityID = null;
        let districtID = null;

        if (cityName) {
            const city = await City.findOne({
                where: {
                    name: { [Op.iLike]: `%${cityName}%`}
                }
            })
            if (!city) {
                return res.status(404).json(new Response(-1, null, "Belirtilen şehir bulunamadı."));
            }
            cityID = city.id;
        }

        if (districtName) {
            const district = await District.findOne({
                where: {
                    name: { [Op.iLike]: `%${districtName}%` } 
                }
            });
            if (!district) {
                return res.status(404).json(new Response(-1, null, "Belirtilen ilçe bulunamadı"));
            }
            console.log(district, 'district');
            districtID = district.id;
        }

        const whereConditions = {};
        if (name) {
            whereConditions.name = { [Op.iLike]: `%${name}%` };
        }
        if (email) {
            whereConditions.email = { [Op.iLike]: `%${email}%` };
        }
        if (phoneNumber) {
            whereConditions.phoneNumber = { [Op.iLike]: `%${phoneNumber}%` };
        }
        if (cityID) {
            whereConditions.cityID = cityID;
        }
        if (districtID) {
            whereConditions.districtID = districtID
        }

        const users = await User.findAll({
            where: whereConditions,
            limit: per_page,
            offset: (page - 1) * per_page,
            attributes: { exclude: ['password', 'accessToken', 'refreshToken'] }
        });

        const count = await User.count({ where: whereConditions });

        const totalPages = Math.ceil(count / per_page);

        res.status(200).json({
            status: 1,
            data: {
                users,
                pagination: {
                    totalItems: count,
                    totalPages: totalPages,
                    currentPage: page
                }
            },
            message: "success"
        });
    } catch (error) {
        console.error(error);
        next(new CustomError('Kullanıcı ararken bir hata oluştu.'));
    }
};


const municipalitiesDetails = async (req,res,next) => {
       
      try {
         const {id} = req.body;

         if (!id) {
             return res.status(400).json({status: -1, message: 'ID zorunludur'})
         }
         
         const municipality  = await Municipality.findOne({
            where: 
            {
                id: id
            }
         })

         
         if (!municipality) {
            return res.status(404).json({ status: -1, message: 'Municipality not found' });
         }

         return res.status(200).json({status: 1, data: municipality})



      } catch (error) {
         return res.status(500).json({status: -1 , message :'Hata'})
      } 
 

}




const getPetTypes = async (req, res, next) => {
    try {
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const per_page = 10;
        const offset = (page - 1) * per_page;

        const { count, rows: pets } = await PetType.findAndCountAll({
            limit: per_page,
            offset: offset 
        });

        const total_pages = Math.ceil(count / per_page);

        return res.status(200).json({
            status: 1,
            data: pets,
            pagination: {
                current_page: page,
                per_page: per_page,
                total_pages: total_pages,
                total_items: count
            }
        });

    } catch (error) {
        return res.status(500).json({ status: -1, message: error.message });
    }
};


const addPetTypes = async (req,res,next) => {
      try {
           const {name} = req.body

           if(!name) {
            return res.status(400).json({status: -1, message: 'Pet bilgili alınamadı'})

           }

           const newPetType = await PetType.create({name})

           return res.status(200).json({status: 1, message: 'Pet Tipi Başarıyla Eklendi', data: newPetType})

            

      } catch (error) {
        return res.status(500).json({status: -1 , message:'Hata'})
      }
}

const deletePetTypes = async (req,res,next) => {
    try {
         const {id} = req.query

         if (!id) {
            return res.status(400).json({status: -1, message:'Bu id de pet tipi bulunamadı'})

         }

         const selectedPetType = await PetType.findOne({where: {id}})

         if (!selectedPetType) {
             return res.status(404).json({status: -1, message: 'Bu id ile eşleşen pet tipi bulunamadı'})
         }

         await PetType.destroy({where: {id}})

         return res.status(200).json({
            status: 1,
            message:'Pet Tipi Başarıyla Silindi',
            data: selectedPetType
         })

    } catch (error) {
        return res.status(500).json({status: -1, message: 'Bir Hata oluştu'})
    }
}



module.exports = {
    login,
    setApproved,
    getMunicipalities,
    deleteMunicipality,
    getUsers,
    deleteUser,
    searchUser,
    municipalitiesDetails,
    getPetTypes,
    addPetTypes,
    deletePetTypes
}