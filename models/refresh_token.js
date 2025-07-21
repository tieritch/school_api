const {Model}=require('objection');
module.exports=class RefreshToken extends Model{
  static get tableName(){
    return 'refresh_tokens';
  }
};
