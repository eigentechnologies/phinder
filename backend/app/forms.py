from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired


class UploaderForm(FlaskForm):
    name = StringField('Candidate name', validators=[DataRequired()])
    submit = SubmitField('Upload')
