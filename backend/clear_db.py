import psycopg2
try:
    conn = psycopg2.connect("dbname='ai_quiz_db' user='postgres' password='root' host='localhost' port='5433'")
    cur = conn.cursor()
    cur.execute("DELETE FROM quizzes_quiz;")
    conn.commit()
    cur.close()
    conn.close()
    print("Deleted all quizzes")
except Exception as e:
    print(e)
