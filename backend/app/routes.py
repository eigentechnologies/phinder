import os

from flask import flash, Flask, jsonify, redirect, render_template, Response, request, send_file, url_for
from wand.image import Image
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


@app.route('/applicant', methods=['GET', 'PUT'])
def applicant():
    if request.method == 'GET':
        applicant = db.session.query(Applicant).filter_by(status='PENDING').first()
        img = Image(filename=os.path.join(app.config['UPLOAD_FOLDER'], f'{applicant.cv}[0]'))
        img_name = applicant.name.replace(' ', '_')
        img.save(filename=os.path.join(app.config['UPLOAD_FOLDER'], f'{img_name}.jpg'))
        if applicant:
            return jsonify(id=applicant.id, name=applicant.name, filename=applicant.cv, image=os.path.join(app.config['UPLOAD_FOLDER'], f'{img_name}.jpg'))
        else:
            return jsonify({})

    if request.method == 'PUT':
        d = request.get_json(force=True)
        applicant = Applicant.query.filter_by(id=d.get('id')).first()
        applicant.status = d.get('decision')
        db.session.commit()
        return jsonify({'success': True})


@app.route('/image', methods=['GET'])
def serve_image():
    img_path = request.get_json(force=True).get('img_path')
    return send_file(img_path, mimetype='image/gif')
