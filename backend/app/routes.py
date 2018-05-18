import os

from flask import flash, Flask, jsonify, redirect, render_template, request, url_for
from werkzeug.utils import secure_filename

from app import app, db
from app.models import Applicant
from app.forms import UploaderForm

@app.route('/')
@app.route('/index')
def index():
    return 'Hello Doctor'


ALLOWED_EXTENSIONS = ['pdf']


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/upload', methods=['GET', 'POST'])
def upload():
    # if current_user.is_authenticated:
    #     return redirect(url_for('index'))
    
    form = UploaderForm()
    if form.validate_on_submit():
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)

        file = request.files['file']
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            applicant = Applicant(name=form.name.data, cv=filename, status='PENDING')
            db.session.add(applicant)
            db.session.commit()
            return redirect(url_for('upload',
                                    filename=filename))

        flash(f'Congratulations! New Applicant registered')
        return redirect(url_for('index'))
    
    return render_template('upload.html', title='Upload', form=form)


@app.route('/applicant', methods=['GET'])
def get_applicant():
    if request.method == 'GET':
        applicant = db.session.query(Applicant).filter_by(status='PENDING').first()
        return jsonify(name=applicant.name, filename=applicant.cv)
#     
#     if request.method == 'PUT':
#         d = request.get_json(force=True)
#         applicant = db.session.query(Applicant).get


