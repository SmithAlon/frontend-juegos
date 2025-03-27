def count_syllables_spanish(word):
    """
    Count syllables in a Spanish word using more accurate rules.
    
    This function implements several rules of Spanish syllabification:
    - Identifies strong vowels (a, e, o) and weak vowels (i, u)
    - Handles diphthongs and triphthongs
    - Considers hiatus (when vowels are pronounced separately)
    
    Args:
        word: The word to count syllables for
        
    Returns:
        The number of syllables in the word
    """
    word = word.lower()
    
    # Remove punctuation if present
    word = ''.join(c for c in word if c.isalpha())
    
    if not word:
        return 0
    
    # Define vowel categories in Spanish
    strong_vowels = "aeoáéó"  # Strong vowels
    weak_vowels = "iuíúü"     # Weak vowels
    accented_weak = "íú"      # Accented weak vowels (can break diphthongs)
    all_vowels = strong_vowels + weak_vowels
    
    # Check for common monosyllabic words first
    if word in COMMON_MONOSYLLABLES:
        return 1
    
    # Count syllables
    syllables = []
    current = ""
    i = 0
    
    while i < len(word):
        current += word[i]
        
        # If we found a vowel
        if word[i] in all_vowels:
            # Check for diphthongs/triphthongs
            if i + 1 < len(word) and word[i+1] in all_vowels:
                v1 = word[i]
                v2 = word[i+1]
                
                v1_is_strong = v1 in strong_vowels
                v2_is_strong = v2 in strong_vowels
                v1_is_accented_weak = v1 in accented_weak
                v2_is_accented_weak = v2 in accented_weak
                
                # Hiatus: two strong vowels or accented weak vowel
                if (v1_is_strong and v2_is_strong) or v1_is_accented_weak or v2_is_accented_weak:
                    # Complete current syllable
                    syllables.append(current)
                    current = ""
                else:
                    # Diphthong: add the second vowel to current syllable
                    i += 1
                    current += word[i]
                    
                    # Check for triphthong (rare)
                    if (i + 1 < len(word) and word[i+1] in weak_vowels and
                        not word[i+1] in accented_weak):
                        i += 1
                        current += word[i]
            
            # End of syllable if we're at a vowel and the next char is a consonant or end of word
            if i + 1 >= len(word) or word[i+1] not in all_vowels:
                syllables.append(current)
                current = ""
                
        # Move to next character
        i += 1
    
    # Add any remaining characters
    if current:
        syllables.append(current)
    
    # Special cases
    # If the word ends with a consonant group that can't end a syllable in Spanish
    # like 'tr', 'dr', 'br', etc. merge the last two syllables
    if len(syllables) >= 2:
        last = syllables[-1]
        if len(last) == 2 and last[0] in "bcdfgkptvz" and last[1] == 'r':
            syllables[-2] += syllables[-1]
            syllables.pop()
    
    return max(1, len(syllables))

def is_monosyllabic(word):
    """Check if a word is monosyllabic in Spanish."""
    return count_syllables_spanish(word) == 1

# Common Spanish monosyllabic words
COMMON_MONOSYLLABLES = {
    "yo", "tú", "él", "mi", "ti", "sí", "no", "más", "ya", "tan", 
    "sol", "mar", "luz", "pan", "vez", "mes", "pie", "pez", "dos", 
    "tres", "diez", "bien", "mal", "quien", "cual", "que", "y", "o",
    "la", "lo", "el", "un", "su", "le", "al", "del", "me", "te", "se",
    "tu", "con", "sin", "por", "que", "de", "en", "a", "e", "es", "fue",
    "ha", "hay", "son", "paz", "fe", "fui", "ves", "ver", "dio", "da",
    # Añadir más palabras monosílabas de 3 letras comunes
    "una", "uno", "los", "las", "nos", "ley", "rey", "hoy", "muy", "tan",
    "son", "dar", "fin", "vez", "voz", "pez", "pie", "ves", "ver", "ser",
    "vas", "van", "voy", "sal", "sed", "red", "tos", "sur", "mes", "tal",
    "mal", "mas", "gas", "sol", "vio", "dio", "fue", "fui", "pan", "pon",
    "pus", "pun", "res", "ron", "soy", "sos", "ves", "vos", "tos", "vil"
} 