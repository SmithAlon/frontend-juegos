from spanish_syllables import count_syllables_spanish, is_monosyllabic

def highlight_text(text, highlight_method="bold"):
    """
    Process text and highlight words according to these rules:
    1. First two letters of words with more than one syllable
    2. First letter of three-letter monosyllabic words (e.g. "una")
    3. First letter of the first word in a pair of consecutive two-letter monosyllabic words
    4. No highlighting for other words
    
    Args:
        text: The input text to process
        highlight_method: How to highlight the text, options are "bold", "uppercase", "asterisk"
    
    Returns:
        The processed text with appropriate highlighting
    """
    words = text.split()
    processed_words = []
    
    # Mantener información sobre la palabra anterior
    prev_word = None
    prev_is_monosyllabic_2_letter = False
    highlighted_prev_mono_pair = False
    
    for i, word in enumerate(words):
        # Extraer la parte alfabética para contar sílabas
        alpha_part = ''.join(c for c in word if c.isalpha())
        current_is_monosyllabic = is_monosyllabic(alpha_part)
        current_is_2_letter = len(word) == 2
        
        # Verificar si es parte de un par de monosílabas de 2 letras
        if prev_is_monosyllabic_2_letter and current_is_monosyllabic and current_is_2_letter and not highlighted_prev_mono_pair:
            # Es la segunda palabra de un par de monosílabas de 2 letras
            # La palabra anterior debe tener la primera letra resaltada
            if len(processed_words) > 0:  # Seguridad
                # Extraer la palabra anterior
                previous = processed_words.pop()
                # Resaltar la primera letra de la palabra anterior
                prefix = previous[:1]
                suffix = previous[1:]
                
                # Aplicar resaltado según el método
                if highlight_method == "bold":
                    highlighted_word = f"\033[1m{prefix}\033[0m{suffix}"
                elif highlight_method == "uppercase":
                    highlighted_word = f"{prefix.upper()}{suffix}"
                elif highlight_method == "asterisk":
                    highlighted_word = f"**{prefix}**{suffix}"
                else:
                    highlighted_word = previous
                    
                processed_words.append(highlighted_word)
                highlighted_prev_mono_pair = True  # Marcar que ya resaltamos en este par
        
        # Restablecer para la próxima palabra
        if not (current_is_monosyllabic and current_is_2_letter):
            highlighted_prev_mono_pair = False
        
        # Procesar la palabra actual según las reglas originales
        if len(word) <= 2:
            # Las palabras de 2 letras o menos se procesan normalmente (sin resaltar)
            processed_words.append(word)
        else:
            # Para palabras de 3+ letras
            if current_is_monosyllabic:
                # Para palabras monosílabas de 3 letras, resaltar la primera letra
                if len(word) == 3:
                    prefix = word[:1]  # Solo la primera letra
                    suffix = word[1:]  # Resto de la palabra
                    
                    # Aplicar resaltado según el método
                    if highlight_method == "bold":
                        highlighted_word = f"\033[1m{prefix}\033[0m{suffix}"
                    elif highlight_method == "uppercase":
                        highlighted_word = f"{prefix.upper()}{suffix}"
                    elif highlight_method == "asterisk":
                        highlighted_word = f"**{prefix}**{suffix}"
                    else:
                        highlighted_word = word
                        
                    processed_words.append(highlighted_word)
                else:
                    # Para otras palabras monosílabas, no resaltar
                    processed_words.append(word)
            else:
                # Para palabras polisílabas, resaltar las primeras dos letras
                prefix = word[:2]
                suffix = word[2:]
                
                # Aplicar resaltado según el método
                if highlight_method == "bold":
                    highlighted_word = f"\033[1m{prefix}\033[0m{suffix}"
                elif highlight_method == "uppercase":
                    highlighted_word = f"{prefix.upper()}{suffix}"
                elif highlight_method == "asterisk":
                    highlighted_word = f"**{prefix}**{suffix}"
                else:
                    highlighted_word = word
                    
                processed_words.append(highlighted_word)
        
        # Actualizar la información de la palabra anterior
        prev_word = word
        prev_is_monosyllabic_2_letter = current_is_monosyllabic and current_is_2_letter
    
    return ' '.join(processed_words)

def main():
    """Main function to run the text processor."""
    print("Bienvenido al Procesador de Texto de Sílabas")
    print("Este programa resalta las primeras dos letras de las palabras con más de una sílaba.")
    print("Y la primera letra de palabras monosílabas de 3 letras.")
    print("Si hay dos palabras monosílabas de 2 letras consecutivas, la primera tendrá su primera letra resaltada.")
    print("Las demás palabras monosílabas no serán resaltadas.")
    print()
    
    while True:
        # Get text input
        text = input("Introduce el texto (o 'salir' para terminar): ")
        
        if text.lower() == 'salir':
            break
        
        # Process the text
        print("\nTexto procesado:")
        print(highlight_text(text, "bold"))
        print()
        
        # Show alternatives
        print("Con mayúsculas:")
        print(highlight_text(text, "uppercase"))
        print()
        
        print("Con asteriscos:")
        print(highlight_text(text, "asterisk"))
        print()

if __name__ == "__main__":
    main() 