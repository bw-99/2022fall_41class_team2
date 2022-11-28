import os

from django.test import TestCase
from output.utils_execution import setup_input, run
from backend.settings.base import BASE_DIR

SERVER_CODE_DIR = str(BASE_DIR) + os.environ['SERVER_CODE_DIR']


class Test(TestCase):

    def test_setup_input_without_white_spaces(self):
        raw = '''1
2 3
'''
        refined = setup_input(raw)

        self.assertTrue(refined[0] == '1')
        self.assertTrue(refined[-1] == '3')

    def test_setup_input_with_white_spaces(self):
        raw = '''


1
2
3   

'''
        refined = setup_input(raw)

        self.assertTrue(refined[0] == '1')
        self.assertTrue(refined[-1] == '3')

    def test_run_unsupported_language(self):
        with self.assertRaises(Exception):
            language = 'golang'
            run(SERVER_CODE_DIR, language, '', '')

    def test_run_when_timeout(self):
        raw_code = '''
import time

def solution():
    time.sleep(15)
'''
        raw_input = '''
3
'''

        response = run(SERVER_CODE_DIR, 'python', raw_code, raw_input)

        self.assertNotEqual(response.get('exit_status'), 0)

    def test_run_python(self):
        raw_code = '''
def solution():
    size = int(input())
    nums = [float(e) for e in input().split()]

    ret = 0
    for num in nums:
        ret += num

    print(ret)
    return ret
'''
        raw_input = '''
4
1 2.1 3.1 4
'''
        response = run(SERVER_CODE_DIR, 'python', raw_code, raw_input)

        self.assertEqual(response.get('exit_status'), 0)
        self.assertEqual(response.get('output'), '10.2')

    def test_run_javascript(self):
        raw_code = '''
const fs = require("fs");
const stdin = fs.readFileSync("/dev/stdin").toString().split("\\n");

const input = (() => {
    let line = 0;
    return () => stdin[line++];
})();

let solution = () => {
    const size = input();

    let ret = 0;
    let nums = input().split(\' \').forEach((val) => {
        ret += Number(val);
    });

    console.log(ret);
    return ret;
}
'''
        raw_input = '''
4
1 2.1 3.1 4
'''
        response = run(SERVER_CODE_DIR, 'javascript', raw_code, raw_input)

        self.assertEqual(response.get('exit_status'), 0)
        self.assertEqual(response.get('output'), '10.2')

    def test_run_c(self):
        raw_code = '''
#include <stdio.h>

void solution() {
    int size = 0;
    scanf(\"%d\", &size);

    float ret = 0;
    while (size--) {
        float num = 0;
        scanf(\"%f\", &num);
        ret += num;
    }

    printf(\"%.1f\\n\", ret);
}
'''
        raw_input = '''
4
1 2.1 3.1 4
'''
        response = run(SERVER_CODE_DIR, 'c', raw_code, raw_input)

        self.assertEqual(response.get('exit_status'), 0)
        self.assertEqual(response.get('output'), '10.2')

    def test_run_cpp(self):
        raw_code = '''
#include <iostream>

using namespace std;

void solution() {
    int size = 0;
    cin >> size;

    float ret = 0;
    while (size--) {
        float num = 0;
        cin >> num;
        ret += num;
    }

    cout << ret << \'\\n\';
}
'''
        raw_input = '''
4
1 2.1 3.1 4
'''
        response = run(SERVER_CODE_DIR, 'cpp', raw_code, raw_input)

        self.assertEqual(response.get('exit_status'), 0)
        self.assertEqual(response.get('output'), '10.2')
