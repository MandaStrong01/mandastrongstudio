from flask import Flask, render_template, redirect, url_for

app = Flask(__name__,
            static_folder='flask_static',
            template_folder='flask_templates')

@app.route('/')
def index():
    return redirect(url_for('page', n=1))

@app.route('/page/<int:n>')
def page(n):
    if n < 1 or n > 21:
        return redirect(url_for('page', n=1))

    if n == 1:
        return render_template('page1.html')
    elif n == 2:
        return render_template('page2.html')
    elif n == 3:
        return render_template('page3.html')
    elif 4 <= n <= 9:
        return render_template('pages4-9.html', page_num=n)
    elif n == 10:
        return render_template('page10.html')
    elif 11 <= n <= 20:
        return render_template('pages11-20.html', page_num=n)
    elif n == 21:
        return render_template('page21.html')

    return redirect(url_for('page', n=1))

@app.route('/login')
def login():
    return "Login page - Coming soon!"

@app.route('/register')
def register():
    return "Register page - Coming soon!"

if __name__ == '__main__':
    app.run(debug=False)
