import pandas as pd
from django.shortcuts import render
from .models import Review
from .forms import CSVUploadForm
from textblob import TextBlob
from django.shortcuts import render
import csv
import io 
def analyze_sentiment(text):
    """Détermine le sentiment d'un texte (Positif, Neutre, Négatif)."""
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity  # Entre -1 (négatif) et 1 (positif)
    if polarity > 0:
        return "Positif"
    elif polarity < 0:
        return "Negatif"
    else:
        return "Neutre"

# def upload_csv(request):
#     return render(request, 'SentimentHub/upload_csv.html')
# def upload_csv(request):
#     if request.method == 'POST':
#         csv_file = request.FILES.get('csv_file')
#         if not csv_file.name.endswith('.csv'):
#             return render(request, 'SentimentHub/upload_csv.html', {'error': 'Le fichier doit être un .csv'})

#         data_set = csv_file.read().decode('UTF-8')
#         io_string = io.StringIO(data_set)
#         csv_reader = csv.reader(io_string, delimiter=',')
#         header = next(csv_reader)  # Lire l'en-tête

#         results = []
#         for row in csv_reader:
#             if row:  # éviter les lignes vides
#                 text = row[13]  # suppose que le texte est dans la première colonne
#                 sentiment = TextBlob(text).sentiment.polarity

#                 if sentiment > 0:
#                     label = 'Positif'
#                 elif sentiment < 0:
#                     label = 'Negatif'
#                 else:
#                     label = 'Neutre'

#                 results.append({'texte': text, 'polarité': sentiment, 'sentiment': label})

#         return render(request, 'SentimentHub/upload_csv.html', {
#             'results': results,
#             'header': header,
#         })

#     return render(request, 'SentimentHub/upload_csv.html')

def upload_csv(request):
    if request.method == 'POST':
        csv_file = request.FILES.get('csv_file')
        if not csv_file.name.endswith('.csv'):
            return render(request, 'SentimentHub/upload_csv.html', {'error': 'Le fichier doit être un .csv'})

        data_set = csv_file.read().decode('UTF-8')
        io_string = io.StringIO(data_set)
        csv_reader = csv.reader(io_string, delimiter=',')
        header = next(csv_reader)  # Lire l'en-tête

        results = []
        positive_count = 0
        negative_count = 0
        neutral_count = 0
        total_polarity = 0
        
        for row in csv_reader:
            if row:  # éviter les lignes vides
                text = row[1]  # suppose que le texte est dans la 14ème colonne (index 13)
                sentiment = TextBlob(text).sentiment.polarity
                total_polarity += sentiment

                if sentiment > 0:
                    label = 'Positif'
                    positive_count += 1
                elif sentiment < 0:
                    label = 'Negatif'
                    negative_count += 1
                else:
                    label = 'Neutre'
                    neutral_count += 1

                results.append({'texte': text, 'polarité': sentiment, 'sentiment': label})
        
        # Calculer les pourcentages et la polarité moyenne
        total_count = len(results)
        if total_count > 0:
            positive_percent = round((positive_count / total_count) * 100)
            negative_percent = round((negative_count / total_count) * 100)
            neutral_percent = round((neutral_count / total_count) * 100)
            average_polarity = total_polarity / total_count
        else:
            positive_percent = 0
            negative_percent = 0
            neutral_percent = 0
            average_polarity = 0
        
        # Créer l'objet stats
        stats = {
            'positive_count': positive_percent,
            'negative_count': negative_percent,
            'neutral_count': neutral_percent,
            'average_polarity': average_polarity
        }
        
        # Stocker les résultats en session pour les récupérer dans la vue rapport
        request.session['analysis_results'] = {
            'results': results,
            'stats': stats
        }

        return render(request, 'SentimentHub/upload_csv.html', {
            'results': results,
            'stats': stats,
            'header': header,
        })

    return render(request, 'SentimentHub/upload_csv.html')

# def rapport(request):
#     # Récupérer les résultats de l'analyse depuis la session
#     analysis_data = request.session.get('analysis_results', {})
    
#     # Si aucune donnée n'est disponible, utiliser des données par défaut
#     if not analysis_data:
#         analysis_data = {
#             'results': [],
#             'stats': {
#                 'positive_count': 65,
#                 'negative_count': 12,
#                 'neutral_count': 23,
#                 'average_polarity': 0.35,
#             }
#         }
    
#     return render(request, 'SentimentHub/rapport.html')

def rapport(request):
    # Récupérer les résultats de l'analyse depuis la session
    analysis_data = request.session.get('analysis_results', {})
    
    # Si aucune donnée n'est disponible, utiliser des données par défaut
    if not analysis_data:
        analysis_data = {
            'results': [],
            'stats': {
                'positive_count': 65,
                'negative_count': 12,
                'neutral_count': 23,
                'average_polarity': 0.35,
            }
        }
    
    # Passer les données au template
    return render(request, 'SentimentHub/rapport.html', analysis_data)

def home(request):
    return render(request, 'SentimentHub/home.html')  # Note the updated path

