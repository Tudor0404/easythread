# Configuration file for the Sphinx documentation builder.
#
# This file only contains a selection of the most common options. For a full
# list see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Path setup --------------------------------------------------------------

# If extensions (or modules to document with autodoc) are in another directory,
# add these directories to sys.path here. If the directory is relative to the
# documentation root, use os.path.abspath to make it absolute, like shown here.
#
# import os
# import sys
# sys.path.insert(0, os.path.abspath('.'))


# -- Project information -----------------------------------------------------

project = 'EasyThread'
copyright = '2021, Tudor Popescu'
author = 'Tudor Popescu'


# -- General configuration ---------------------------------------------------
from tokenize import tabsize
import sphinx_rtd_theme

# Add any Sphinx extension module names here, as strings. They can be
# extensions coming with Sphinx (named 'sphinx.ext.*') or your custom
# ones.
extensions = [
    'sphinx_rtd_theme'
]

# Add any paths that contain templates here, relative to this directory.
templates_path = ['_templates']

# List of patterns, relative to source directory, that match files and
# directories to ignore when looking for source files.
# This pattern also affects html_static_path and html_extra_path.
exclude_patterns = ['_build', 'Thumbs.db', '.DS_Store']

# latex customisation
latex_elements = {
    'papersize' : 'a4paper',
    'pointsize' : '12pt',
    'fontpkg': r'\usepackage[sfdefault]{roboto}\usepackage[T1]{fontenc}', # change font to roboto
    'preamble': r'\usepackage[labelformat=empty]{caption}\usepackage{enumitem}\setlistdepth{99}\usepackage[utf8]{inputenc}\usepackage{pmboxdraw}\fvset{fontsize=auto}\usepackage{caption}', # remove 'fig {}' prefix to figures
    'figure_align': 'H', # prevents automatic order of figures
}

# -- Options for HTML output -------------------------------------------------

# The theme to use for HTML and HTML Help pages.  See the documentation for
# a list of builtin themes.

html_theme = "sphinx_rtd_theme"

# Add any paths that contain custom static files (such as style sheets) here,
# relative to this directory. They are copied after the builtin static files,
# so a file named "default.css" will overwrite the builtin "default.css".
html_static_path = ['_static']

tabsize = 4