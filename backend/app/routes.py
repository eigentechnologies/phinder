import os

from app import app
from flask import flash, Flask, request, redirect, render_template, url_for
from werkzeug.utils import secure_filename

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
    # if form.validate_on_submit():
    #     user = Applicant(name=form.name.data, cv=form.cv.data)
    #     user.set_password(form.password.data)
    #     flash(f'Congratulations! New Applicant registered')
    #     return redirect(url_for('index'))
    
    return render_template('upload.html', title='Upload')#, form=form)
    return '''
    <!doctype html>
    <title>Upload new File</title>
    <h1>Upload new File</h1>
    <form method=post enctype=multipart/form-data>
      <p><input type=file name=file>
         <input type=submit value=Upload>
    </form>
    '''


# @app.route('/upload', methods=['GET', 'POST'])
# def upload_file():
#     if request.method == 'POST':
#         if 'file' not in request.files:
#             flash('No file part')
#             return redirect(request.url)
# 
#         file = request.files['file']
#         if file.filename == '':
#             flash('No selected file')
#             return redirect(request.url)
# 
#         if file and allowed_file(file.filename):
#             filename = secure_filename(file.filename)
#             file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
#             return redirect(url_for('uploaded_file',
#                                     filename=filename))
# 
#     return render_template('upload.html', title='Upload', form=form, user=user)
    # return '''
    # <!doctype html>
    # <title>Upload new File</title>
    # <h1>Upload new File</h1>
    # <form method=post enctype=multipart/form-data>
    #   <p><input type=file name=file>
    #      <input type=submit value=Upload>
    # </form>
    # '''
