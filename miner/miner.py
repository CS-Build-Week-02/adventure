import hashlib
import requests

import sys
import threading
from functools import wraps
# things our blockchain is missing 
# 
import time

# TODO: Implement functionality to search for a proof 
def proof_of_work(last_proof, difficulty):
    """
    Simple Proof of Work Algorithm
    Find a number p such that hash(last_block_string, p) contains 6 leading
    zeroes
    """
    print("starting work on a new proof")
    proof = 0
    guess = f'{last_proof}{proof}'.encode()
    print(hashlib.sha256(guess).hexdigest())
    print(proof)
    
    while valid_proof(last_proof, proof, difficulty) is False:
        
        proof += 1
    
    return proof
    

def valid_proof(last_proof, proof, difficulty):
    """
    Validates the Proof:  Does hash(block_string, proof) contain 6
    leading zeroes?
    difficutly returned by last proof function
    """

    guess = f'{last_proof}{proof}'.encode()
    
    guess_hash = hashlib.sha256(guess).hexdigest()
    
    beg = guess_hash[:difficulty]

    dif = difficulty
    string= "0"
    while dif > 1:
        string += "0"
        dif -= 1
 
    if beg == string:
        print("HEEEEELLLLLLLYEAAAAAAAAAAAAH!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        return True
    else:
        return False

    # TODO
    # pass

def cool_down(cd=0):
    
    def wrap(f):
        @wraps(f)
        def delayed(*args, **kwargs):
            timer = threading.Timer(cd, f, args=args, kwargs=kwargs)
            timer.start()
        return delayed
    return wrap
    



if __name__ == '__main__':
    # What node are we interacting with?
    if len(sys.argv) > 1:
        node = sys.argv[1]
    else:
        node = 'https://lambda-treasure-hunt.herokuapp.com/api/bc'

    coins_mined = 0

   
    
    # Run forever until interrupted
    while True:
        # TODO: Get the last proof from the server and 
        # generate a request with last_proof
        cooldown = 44
        
        time.sleep(cooldown)
        req = requests.get(node+'/last_proof', headers={'Authorization': 'Token 47c29baf79a10ccedc4a36c04da77ea8b33bbc35', 'Content-Type': 'application/json'})
        print(req.text)
        # req.encoding = 'utf-8'
        # req.text.json()
        request = req.json()
        print("REQUEST: ", request)
        proof = request['proof']
        difficulty = request['difficulty']
        cooldown = request['cooldown']
        # look for a new one
        new_proof = proof_of_work(proof, difficulty)
        string = new_proof

        data = {
            "proof":string
        }

        print('THIS IS WHAT NEEDS TO BE POSTED WITH POSTMAN')
        print(data)
        print('THIS IS WHAT NEEDS TO BE POSTED WITH POSTMAN')

        # TODO: We're going to have to research how to do a POST in Python
        # HINT: Research `requests` and remember we're sending our data as JSON
        time.sleep(cooldown)
        r = requests.post(url = node+'/mine',headers={'Authorization': 'Token 47c29baf79a10ccedc4a36c04da77ea8b33bbc35', 'Content-Type': 'application/json'} ,data = data )
        print(r.content)
        cooldown = r.content['cooldown']
        
       

        pass

# should be able to continously searching for new proofs and display 