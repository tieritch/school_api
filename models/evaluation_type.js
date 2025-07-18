const{Model}=require('objection');
const path=require('path');

module.exports=class EvaluationType extends Model{

    static get tableName(){
        return 'evaluation_types';
    }

    static get relationMappings(){
        return {
            scores:{
                relation:Model.HasManyRelation,
                modelClass:path.join(__dirname,'score'),
                join:{
                    from:'evaluation_types.id',
                    to:'scores.evaluation_type_id'
                }
            }
        }
    }

    $beforeInsert(){
        this.name=this.name.trim().toLowerCase();
    }

    $beforeUpdate(){
        if(this.name){
            this.name=this.name.trim().toLowerCase();
        }
    }
}